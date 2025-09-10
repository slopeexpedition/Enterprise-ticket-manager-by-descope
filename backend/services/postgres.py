from sqlalchemy import create_engine, text
from typing import Dict, List

class PostgresClient:
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
        
    def get_ticket_stats(self) -> Dict:
        with self.engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 
                    COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count,
                    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_count,
                    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count
                FROM tickets
            """))
            row = result.fetchone()
            return {
                "open": row.open_count if row else 0,
                "closed": row.closed_count if row else 0,
                "in_progress": row.in_progress_count if row else 0
            }
        
    def search_tickets(self, query: str, status: str = None) -> List[Dict]:
        with self.engine.connect() as conn:
            sql = """
                SELECT *
                FROM tickets
                WHERE description ILIKE :query
            """
            if status:
                sql += " AND status = :status"
                
            result = conn.execute(
                text(sql),
                {"query": f"%{query}%", "status": status}
            )
            return [dict(row) for row in result]
        
    def get_ticket_details(self, ticket_id: str) -> Dict:
        with self.engine.connect() as conn:
            result = conn.execute(
                text("SELECT * FROM tickets WHERE id = :id"),
                {"id": ticket_id}
            )
            row = result.fetchone()
            return dict(row) if row else None
