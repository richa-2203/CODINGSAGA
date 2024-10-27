const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs'); // File system module for JSON handling
const session = require('express-session'); // Import express-session

const app = express();

// Configure session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Handle JSON data

// Load users from JSON file
const loadUsers = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users.json:', error);
        return []; // Return an empty array if the file read fails
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Get user session data
app.get('/session-user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json(null); // No user found
    }
});

app.post('/login', (req, res) => {
    const { rollNumber, password } = req.body; // Changed email to rollNumber
    
    // Load users from the JSON file
    const users = loadUsers();
    
    // Find user with matching roll number and password
    const user = users.find(user => user.rollNumber === rollNumber && user.password === password); // Updated search condition
    
    if (user) {
        // Set user data in session
        req.session.user = { username: user.username, rollNumber: user.rollNumber }; // Changed email to rollNumber

        switch (user.role) {
            case 'student':
                return res.redirect('/student');
            case 'security':
                return res.redirect('/security');
            case 'admin':
                return res.redirect('/admin');
            default:
                return res.redirect('/');
        }
    } else {
        res.redirect('/?error=invalid');
    }
});

//Route for each role page
app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/security', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'security.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route to get leave requests by roll number
app.get('/api/leave-requests/:rollNumber', (req, res) => {
    const { rollNumber } = req.params;

    // Load existing leave requests
    const requests = loadLeaveRequests();

    // Filter requests by roll number
    const filteredRequests = requests.filter(request => request.rollNumber === rollNumber);

    res.json(filteredRequests);
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // Adjust this path to where your login.html is located
});

// API to create a leave request and save to JSON file
// API to create a leave request and save to JSON file
app.post('/api/leave-requests', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'User not logged in.' });
    }

    const { name, branch, phoneNumber, email, dateOfLeave, dateOfReturn } = req.body;
    const rollNumber = req.session.user.rollNumber; // Use roll number from session

    const newLeaveRequest = {
        name,
        branch,
        rollNumber, // Assign roll number from session
        phoneNumber,
        email,
        dateOfLeave,
        dateOfReturn,
        createdAt: new Date(), // Timestamp the request creation
        status: 'Pending' // Default status
    };

    // Load existing requests, add new request, and save back to JSON file
    const requests = loadLeaveRequests();
    requests.push(newLeaveRequest);
    saveLeaveRequests(requests);

    res.status(201).json({ message: 'Leave request submitted successfully.', leaveRequest: newLeaveRequest });
});


// Helper functions to load and save leave requests
const loadLeaveRequests = () => {
    try {
        const data = fs.readFileSync('leaveRequests.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading leaveRequests.json:', error);
        return []; // Return empty array if file read fails
    }
};

app.get('/api/leaveRequests', (req, res) => {
    const filePath = path.join(__dirname, 'leaveRequests.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.get('/api/records/:rollNumber', (req, res) => {
    const { rollNumber } = req.params; // Get rollNumber from the request parameters
    const filePath = path.join(__dirname, 'records.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        try {
            const jsonData = JSON.parse(data); // Parse the JSON data
            // Filter records that match the provided rollNumber
            const userRecords = jsonData.filter(record => record.rollNumber === rollNumber);

            if (userRecords.length === 0) {
                return res.status(404).json({ error: 'No records found for this roll number' });
            }

            res.json(userRecords); // Send the user records as the response
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

app.get('/records', (req, res) => {
    fs.readFile(path.join(__dirname, 'records.json'), 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading records:", err);
            return res.status(500).json({ message: "Error reading records" });
        }
        res.json(JSON.parse(data));
    });
});

// Route to update records
app.post('/update-records', (req, res) => {
    const newRecords = req.body;

    fs.writeFile(path.join(__dirname, 'records.json'), JSON.stringify(newRecords, null, 2), (err) => {
        if (err) {
            console.error("Error writing records:", err);
            return res.status(500).json({ message: "Error writing records" });
        }
        res.json({ message: "Records updated successfully" });
    });
});
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaveRequests.json'));
});

app.get('/record', (req, res) => {
    const filePath = path.join(__dirname, 'records.json'); // Adjust the path as necessary
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        try {
            const jsonData = JSON.parse(data); // Parse the JSON data
            res.json(jsonData); // Send JSON data as response
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

const leaveRequestsFilePath = path.join(__dirname, 'leaveRequests.json');
//const recordsFilePath = path.join(__dirname, 'records.json');

// Endpoint to update the status of a leave request
// Endpoint to update the status of a leave request
app.post('/api/update-status', (req, res) => {
    const { rollNumber, createdAt, status } = req.body; // Now includes createdAt

    // Read the leave requests from the JSON file
    fs.readFile(leaveRequestsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        }

        let leaveRequests;
        try {
            leaveRequests = JSON.parse(data); // Parse the JSON data
        } catch (parseError) {
            return res.status(500).json({ message: 'Error parsing data file' });
        }

        // Find the leave request by roll number and createdAt
        const request = leaveRequests.find(r => r.rollNumber === rollNumber && new Date(r.createdAt).getTime() === new Date(createdAt).getTime());

        if (request) {
            request.status = status; // Update the status

            // Write the updated leave requests back to the JSON file
            fs.writeFile(leaveRequestsFilePath, JSON.stringify(leaveRequests, null, 2), (writeErr) => {
                if (writeErr) {
                    return res.status(500).json({ message: 'Error saving data file' });
                }

                res.status(200).json({ message: `Status updated to ${status} successfully!` });
            });
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    });
});

const saveLeaveRequests = (requests) => {
    try {
        fs.writeFileSync('leaveRequests.json', JSON.stringify(requests, null, 2), 'utf8');
        console.log('leaveRequests.json updated successfully.');
    } catch (error) {
        console.error('Error writing to leaveRequests.json:', error);
    }
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});