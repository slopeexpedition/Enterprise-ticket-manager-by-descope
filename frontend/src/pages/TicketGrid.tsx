import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useSession } from '@descope/react-sdk';
import axios from 'axios';

interface Ticket {
  id: string;
  system: string;
  status: string;
  description: string;
  created_at: string;
}

const TicketGrid = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [system, setSystem] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { sessionToken } = useSession();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/tickets/search?query=${searchQuery}${system ? `&system=${system}` : ''}`,
          { headers: { Authorization: `Bearer ${sessionToken}` } }
        );
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, [searchQuery, system, sessionToken]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <TextField
            label="Search Tickets"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>System</InputLabel>
            <Select
              value={system}
              label="System"
              onChange={(e) => setSystem(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="servicenow">ServiceNow</MenuItem>
              <MenuItem value="dynamics365">Dynamics 365</MenuItem>
              <MenuItem value="custom">Custom System</MenuItem>
            </Select>
          </FormControl>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>System</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.system}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default TicketGrid;
