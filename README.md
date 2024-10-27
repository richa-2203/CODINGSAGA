# CODINGSAGA
# GateHub- Secure Digital Pass for Campus
### *One click, No trick- Just Go Quick!*

## Table of Contents
- [Problem Statement](#problem-statement)
- [Challenges Faced](#challenges-faced)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [References](#referrences)
- [Project Flow Structure](#project-flow-structure)

## Problem Statement
Many educational institutions, including our own, struggle with managing student leave requests and approvals efficiently. The reliance on paper-based systems leads to delays, confusion, and unnecessary trips between students and wardens. Our solution digitizes this process, allowing students to submit leave requests and get approvals with a single click. This system streamlines communication between students, admins, and security personnel, enhancing overall campus security and efficiency.

## Challenges Faced
- **Data Security and Privacy**: Ensuring the protection of sensitive student information against unauthorized access and data breaches.
- **Real-Time Data Syncing**: Achieving seamless real-time updates across the system, especially during high volumes of leave requests.
- **Reliable QR Code Scanning**: Ensuring quick and accurate QR code scanning under varying conditions.
- **Integration with Existing Systems**: Merging the new digital system with any pre-existing databases or security systems.
- **User Interface and Experience (UI/UX)**: Designing an intuitive and user-friendly interface for all types of users (students, admins, security).
- **Data Accuracy and Integrity**: Maintaining the correctness of leave data and preventing unauthorized changes.
- **Scalability**: Building a system that can handle increased user loads as more students use the application.

## Technologies Used
- **Frontend**: 
  - HTML, CSS, JavaScript
  - Font Awesome for icons
  - OpenCv.js for genrating unique QR codes 

- **Backend**: 
  - Node.js for server-side logic
  - Express.js for building RESTful APIs and routing

- **QR Code Scanning**:
  - ZXing for scanning QR codes efficiently

- **Deployment**:
  - GitHub for version control and collaboration
 
 ## Installation
1. Install Node.js, express.js, node-modules and dependencies
   ```bash
   npm install
2. Clone the repository:
   ```bash
   git clone https://github.com/richa-2203/Coding_saga.git

## Usage
- **Access the application at http://localhost:3000 in your web browser.**
- **Students can log in to submit leave requests and view their approval status.**
- **Admins can manage leave requests and approve or deny submissions.**
- **Security personnel can scan students’ QR codes to verify their leave status at campus entry and exit points.**

## Contributors
- Moonlinti Vaishnavi Reddy (Team Leader and Backend)
- Richa Rajashekhar (Backend)
- K S Prakruthi (Frontend)
- Maitreyee Kumbhojkar (Frontend and Backend) 

## References
- https://github.com/bradtraversy/qr-code-generator
- LLMs
- https://youtu.be/SrZuwM705yE?si=_RLNOgS77Le4X1Vj

## Project Flow Structure 

```plaintext
.
├── public/
│   ├── admin.css
│   ├── admin.html
│   ├── generateqr.html
│   ├── login.html
│   ├── result1.html
│   ├── result2.html
│   ├── scan.html
│   ├── security.css
│   ├── security.html
│   ├── student.html
│   ├── studentstyle.css
│   ├── style.css
│   └── styleqr.css
├── leaveRequests.json
├── package-lock.json
├── package.json
├── records.json
├── report.txt
├── server.js
└── users.json

