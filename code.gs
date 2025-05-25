/**
 * Google Apps Script to create Google Quizzes programmatically from an internal data structure.
 * This version supports creating both Multiple Choice and Checkbox questions.
 * It shuffles the options for each question type.
 *
 * TO USE:
 * 1. Edit the `QUIZ_TITLE`, `QUIZ_DESCRIPTION`, `TARGET_DRIVE_FOLDER_NAME`.
 * 2. The `QUIZ_DATA` array below has been populated based on the provided text,
 *    excluding exhibit/PT/matching questions. It now uses `correctAnswers` array.
 * 3. Run the `createQuizFromInternalData` function from the Apps Script editor.
 *
 * REQUIRED SCOPES (ensure these are in appsscript.json if manually editing):
 * "https://www.googleapis.com/auth/forms"
 * "https://www.googleapis.com/auth/drive" (for moving the form)
 * "https://www.googleapis.com/auth/script.container.ui" (optional, for alerts in bound scripts)
 */

// --- USER CONFIGURABLE QUIZ SETTINGS ---
const QUIZ_TITLE = "Networking Basics Course Final Exam (Generated)";
const QUIZ_DESCRIPTION = "A quiz generated from the provided networking questions, supporting Multiple Choice and Checkbox.";
const TARGET_DRIVE_FOLDER_NAME = "Generated Quizes"; // Folder in My Drive. Set to "" or null to keep in root. You can change this folder name.

// --- USER CONFIGURABLE QUIZ DATA ---
// Each object in this array represents one question.
// - questionText: The question itself (string).
// - choices: An array of answer options (array of strings).
// - correctAnswers: An array of strings, where each string is the exact text of a correct answer.
//                   If this array has ONE element, a Multiple Choice question is created.
//                   If this array has MULTIPLE elements, a Checkbox question is created.
// - points: The point value for the question (number).
// NOTE: Questions requiring exhibits, PT activities, or matching have been excluded.
const QUIZ_DATA = [
  {
    questionText: "Which statement describes the use of powerline networking technology?",
    choices: [
      "A device connects to an existing home LAN using an adapter and an existing electrical outlet.",
      "New “smart” electrical cabling is used to extend an existing home LAN.",
      "Wireless access points use powerline adapters to distribute data through the home LAN.",
      "A home LAN is installed without the use of physical cabling."
    ],
    correctAnswers: ["A device connects to an existing home LAN using an adapter and an existing electrical outlet."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which wireless RF band do IEEE 802.11b/g devices use?",
    choices: [
      "60 GHz",
      "2.4 GHz",
      "900 MHz",
      "5 GHz"
    ],
    correctAnswers: ["2.4 GHz"], // Multiple Choice (1 correct answer)
    points: 5
  },
   {
    questionText: "Which security test is appropriate for detecting system weaknesses such as misconfiguration, default passwords, and potential DoS targets?",
    choices: [
      "Vulnerability scanning",
      "Network mapping",
      "Integrity checking",
      "Log analysis"
    ],
    correctAnswers: ["Vulnerability scanning"], // Multiple Choice
    points: 5
  },
  {
    questionText: "How does network scanning primarily help assess operations security?",
    choices: [
      "It can detect open TCP/UDP ports on network systems.",
      "It can simulate sophisticated attacks from malicious sources.",
      "It can automatically patch detected vulnerabilities.",
      "It can analyze application source code for flaws."
    ],
    correctAnswers: ["It can detect open TCP/UDP ports on network systems."], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is the objective of the governing policy in the security policy hierarchy structure?",
    choices: [
      "It outlines the company’s overall security goals for managers and technical staff.",
      "It provides detailed step-by-step instructions for end-users.",
      "It specifies the exact hardware and software to be used for security.",
      "It lists the penalties for non-compliance with security procedures."
    ],
    correctAnswers: ["It outlines the company’s overall security goals for managers and technical staff."], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which type of security policy document typically includes implementation details that usually contain step-by-step instructions and graphics?",
    choices: [
      "Procedure document",
      "Guideline document",
      "Standards document",
      "Governing policy document"
    ],
    correctAnswers: ["Procedure document"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is the primary purpose of a security awareness campaign?",
    choices: [
      "To focus the attention of employees on security issues and their importance.",
      "To provide in-depth technical training on specific security tools.",
      "To certify employees in various security competencies.",
      "To replace the need for technical security controls."
    ],
    correctAnswers: ["To focus the attention of employees on security issues and their importance."], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is a key goal of network penetration testing?",
    choices: [
      "Determining the feasibility of an attack and the potential consequences of a successful breach.",
      "Continuously monitoring network traffic for anomalies.",
      "Ensuring all systems are patched and up-to-date.",
      "Cataloging all assets on the network."
    ],
    correctAnswers: ["Determining the feasibility of an attack and the potential consequences of a successful breach."], // Multiple Choice
    points: 5
  },
    {
    questionText: "What network security testing tool has the ability to aggregate log data and provide details on the source of suspicious network activity?",
    choices: [
      "SIEM (Security Information and Event Management)",
      "Nessus",
      "Aircrack-ng",
      "John the Ripper"
    ],
    correctAnswers: ["SIEM (Security Information and Event Management)"], // Multiple Choice
    points: 5
  },
    {
    questionText: "What network scanning tool has advanced features that allow it to use decoy hosts to mask the source of the scan?",
    choices: [
      "Nmap",
      "Wireshark",
      "Snort",
      "Metasploit"
    ],
    correctAnswers: ["Nmap"], // Multiple Choice
    points: 5
  },
    {
    questionText: "What network testing tool can be used to identify network layer protocols (e.g., IP, ICMP) and open ports running on a host?",
    choices: [
      "Nmap",
      "L0phtCrack",
      "Tripwire",
      "Cain and Abel"
    ],
    correctAnswers: ["Nmap"], // Multiple Choice
    points: 5
  },
    {
    questionText: "What type of network security test would be used by network administrators for detection and reporting of unauthorized changes to network system files?",
    choices: [
      "Integrity checking (e.g., using Tripwire)",
      "Penetration testing",
      "Vulnerability scanning",
      "Network sniffing"
    ],
    correctAnswers: ["Integrity checking (e.g., using Tripwire)"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What testing tool is available for network administrators who need a GUI version of Nmap?",
    choices: [
      "Zenmap",
      "Nessus Dashboard",
      "Metasploit Armitage",
      "Wireshark GTK"
    ],
    correctAnswers: ["Zenmap"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which initial step should be followed when a security breach is found on a corporate system?",
    choices: [
      "Isolate the infected system from the network.",
      "Immediately power off the system to prevent further damage.",
      "Start deleting suspicious files.",
      "Notify all employees via company-wide email."
    ],
    correctAnswers: ["Isolate the infected system from the network."], // Multiple Choice
    points: 5
  },
  {
    questionText: "In a forensic investigation, what step should typically be taken after data collection from a compromised system is complete, but before the equipment is disconnected or moved?",
    choices: [
      "Photograph the system and its surroundings.",
      "Create a full drive image of the system.",
      "Establish a chain of custody for the evidence.",
      "Begin analyzing the collected data for malware."
    ],
    correctAnswers: ["Photograph the system and its surroundings."], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which security program component is aimed at all levels of an organization, including end users and executive staff, to remind them of security best practices?",
    choices: [
      "Awareness campaigns",
      "Technical certification programs",
      "Formal degree programs in cybersecurity",
      "Firewall configuration training courses"
    ],
    correctAnswers: ["Awareness campaigns"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is implemented by an organization's administration to instruct end users on how to effectively conduct business safely and securely?",
    choices: [
      "A security awareness program",
      "A detailed governing policy document",
      "A list of noncompliance consequences",
      "A highly technical server hardening policy"
    ],
    correctAnswers: ["A security awareness program"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which of the following is a major component of a comprehensive security awareness program?",
    choices: [
      "Education and training sessions for employees",
      "Deployment of advanced intrusion detection systems",
      "Regular auditing of technical security policies",
      "Penalties for violating acceptable use policies"
    ],
    correctAnswers: ["Education and training sessions for employees"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which type of security documents include implementation details that usually contain step-by-step instructions and graphics for specific tasks?",
    choices: [
      "Procedure documents",
      "Standards documents",
      "Guideline documents",
      "Governing policy documents"
    ],
    correctAnswers: ["Procedure documents"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which type of documents help an organization establish consistency in its network operations by specifying mandatory criteria that must be followed?",
    choices: [
      "Standards documents",
      "Guideline documents",
      "Procedure documents",
      "End-user acceptable use policies"
    ],
    correctAnswers: ["Standards documents"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which policy outlines the overall security goals and high-level objectives for managers and technical staff within a company?",
    choices: [
      "Governing policy",
      "Acceptable use policy",
      "Technical implementation policy",
      "Data backup and recovery policy"
    ],
    correctAnswers: ["Governing policy"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which type of security policy typically includes network access standards, server security configurations, and application hardening requirements?",
    choices: [
      "Technical policy",
      "End-user policy",
      "Governing policy",
      "Incident response policy"
    ],
    correctAnswers: ["Technical policy"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which type of security policy would define acceptable encryption methods and algorithms to be used within an organization?",
    choices: [
      "Technical policy",
      "Governing policy",
      "Acceptable use policy for email",
      "End-user password policy"
    ],
    correctAnswers: ["Technical policy"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is the primary determining factor in the content and detail level of a specific security policy within an organization?",
    choices: [
      "The intended audience of the policy",
      "The preferences of the CISO",
      "The latest security industry best practices",
      "The budget allocated for security initiatives"
    ],
    correctAnswers: ["The intended audience of the policy"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which executive position is ultimately responsible for the overall success and strategic direction of an organization?",
    choices: [
      "Chief Executive Officer (CEO)",
      "Chief Technology Officer (CTO)",
      "Chief Security Officer (CSO/CISO)",
      "Chief Information Officer (CIO)"
    ],
    correctAnswers: ["Chief Executive Officer (CEO)"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which network security testing tool is primarily used to assess if network device configurations are compliant with established security policies by checking for unauthorized changes?",
    choices: [
      "Tripwire",
      "Nessus",
      "Nmap",
      "Metasploit"
    ],
    correctAnswers: ["Tripwire"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which network security testing tool is well-known for scanning systems to identify software vulnerabilities and misconfigurations?",
    choices: [
      "Nessus",
      "Tripwire",
      "Nmap",
      "Wireshark"
    ],
    correctAnswers: ["Nessus"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which network security testing tool is primarily used for network discovery, host identification, and Layer 3/4 port scanning?",
    choices: [
      "Nmap",
      "Nessus",
      "Tripwire",
      "Aircrack-ng"
    ],
    correctAnswers: ["Nmap"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is a disadvantage of deploying a peer-to-peer network model?",
    choices: [
      "lack of centralized administration",
      "high cost",
      "difficulty of setup",
      "high degree of complexity"
    ],
    correctAnswers: ["lack of centralized administration"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which three steps must be completed to manually connect an Android or IOS device to a secured wireless network?",
    choices: [
      "Change the MAC address.",
      "Set the IP address.",
      "Enter the network SSID.",
      "Activate the Bluetooth antenna.",
      "Input the authentication password.",
      "Choose the correct security type."
    ],
    correctAnswers: [
      "Enter the network SSID.",
      "Input the authentication password.",
      "Choose the correct security type."
    ], // Checkbox (3 correct answers)
    points: 5
  },
  {
    questionText: "A company is contemplating whether to use a client/server or a peer-to-peer network. What are three characteristics of a peer-to-peer network?",
    choices: [
      "better security",
      "scalable",
      "easy to create",
      "better device performance when acting as both client and server",
      "less cost to implement",
      "lacks centralized administration"
    ],
    correctAnswers: [
      "easy to create",
      "less cost to implement",
      "lacks centralized administration"
    ], // Checkbox (3 correct answers)
    points: 5
  },
  {
    questionText: "Which type of device provides an Internet connection through the use of a phone jack?",
    choices: [
      "satellite modem",
      "Wi-Fi AP",
      "DSL modem",
      "cable modem"
    ],
    correctAnswers: ["DSL modem"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A traveling sales representative uses a cell phone to interact with the home office and customers, track samples, make sales calls, log mileage, and upload/download data while at a hotel. Which internet connectivity method would be a preferred method to use on the mobile device due to the low cost?",
    choices: [
      "cellular",
      "Wi-Fi",
      "DSL",
      "cable"
    ],
    correctAnswers: ["Wi-Fi"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A user is configuring a wireless access point and wants to prevent any neighbors from discovering the network. What action does the user need to take?",
    choices: [
      "Configure DMZ settings.",
      "Disable SSID broadcast.",
      "Configure a DNS server.",
      "Enable WPA encryption."
    ],
    correctAnswers: ["Disable SSID broadcast."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A tourist is traveling through the countryside and needs to connect to the internet from a laptop. However, the laptop only has Wi-Fi and Ethernet connections. The tourist has a smartphone with 3G/4G connectivity. What can the tourist do to allow the laptop to connect to the internet?",
    choices: [
      "Enable tethering and create a hotspot.",
      "Use the smartphone to access web pages and then pass the web pages to the laptop.",
      "Use the smartphone to access the internet through a satellite connection and then share that connection with the laptop.",
      "Use an Ethernet cable to connect the smartphone to the laptop."
    ],
    correctAnswers: ["Enable tethering and create a hotspot."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What layer is responsible for routing messages through an internetwork in the TCP/IP model?",
    choices: [
      "network access",
      "session",
      "transport",
      "internet"
    ],
    correctAnswers: ["internet"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What will a Cisco LAN switch do if it receives an incoming frame and the destination MAC address is not listed in the MAC address table?",
    choices: [
      "Send the frame to the default gateway address.",
      "Drop the frame.",
      "Forward the frame out all ports except the port where the frame is received.",
      "Use ARP to resolve the port that is related to the frame."
    ],
    correctAnswers: ["Forward the frame out all ports except the port where the frame is received."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What process involves placing one message format inside of another message format?",
    choices: [
      "flow control",
      "encapsulation",
      "encoding",
      "segmentation"
    ],
    correctAnswers: ["encapsulation"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A cable installation company is trying to convince a customer to use fiber-optic cabling instead of copper cables for a particular job. What is one advantage of using fiber-optic cabling compared to copper cabling?",
    choices: [
      "The installation skills required for fiber-optic cabling are lower.",
      "Fiber-optic cabling can transmit signals without attenuation.",
      "Fiber-optic cabling is completely immune to EMI and RFI.",
      "The cost of fiber-optic connectors is lower."
    ],
    correctAnswers: ["Fiber-optic cabling is completely immune to EMI and RFI."], // Multiple Choice (1 correct answer, although source explanation mentions another)
    points: 5
  },
  {
    questionText: "What data encoding technology is used in copper cables?",
    choices: [
      "electrical pulses",
      "modulation of specific frequencies of electromagnetic waves",
      "modulation of light rays",
      "pulses of light"
    ],
    correctAnswers: ["electrical pulses"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What information is added to the switch table from incoming frames?",
    choices: [
      "destination IP address and incoming port number",
      "source MAC address and incoming port number",
      "source IP address and incoming port number",
      "destination MAC address and incoming port number"
    ],
    correctAnswers: ["source MAC address and incoming port number"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "At which layer of the OSI model would a logical address be added during encapsulation?",
    choices: [
      "network layer",
      "physical layer",
      "transport layer",
      "data link layer"
    ],
    correctAnswers: ["network layer"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which type of network model describes the functions that must be completed at a particular layer, but does not specify exactly how each protocol should work?",
    choices: [
      "reference model",
      "hierarchical design model",
      "protocol model",
      "TCP/IP model"
    ],
    correctAnswers: ["reference model"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which two criteria are used to help select a network medium for a network?",
    choices: [
      "the environment where the selected medium is to be installed",
      "the cost of the end devices that are used in the network",
      "the number of intermediate devices that are installed in the network",
      "the distance the selected medium can successfully carry a signal",
      "the types of data that need to be prioritized" // Added 5th option to fit MC/Checkbox structure easily
    ],
    correctAnswers: [
      "the environment where the selected medium is to be installed",
      "the distance the selected medium can successfully carry a signal"
    ], // Checkbox (2 correct answers)
    points: 5
  },
  {
    questionText: "Which scenario is suitable for deploying twisted-pair cables?",
    choices: [
      "to connect network devices in backbone networks",
      "to connect a TV set to the wall plug at home",
      "to connect data centers with high bandwidth requirements over long distances",
      "to connect PC workstations in an office"
    ],
    correctAnswers: ["to connect PC workstations in an office"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A company uses DHCP servers to dynamically assign IPv4 addresses to employee workstations. The address lease duration is set as 5 days. An employee returns to the office after an absence of one week. When the employee boots the workstation, it sends a message to obtain an IP address. Which Layer 2 and Layer 3 destination addresses will the message contain?",
    choices: [
      "FF-FF-FF-FF-FF-FF and 255.255.255.255",
      "MAC address of the DHCP server and 255.255.255.255",
      "FF-FF-FF-FF-FF-FF and IPv4 address of the DHCP server",
      "both MAC and IPv4 addresses of the DHCP server"
    ],
    correctAnswers: ["FF-FF-FF-FF-FF-FF and 255.255.255.255"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What are two characteristics of multicast transmission?",
    choices: [
      "The source address of a multicast transmission is in the range of 224.0.0.0 to 224.0.0.255.",
      "Multicast transmission can be used by routers to exchange routing information.",
      "A single packet can be sent to a group of hosts.",
      "Multicast messages map lower layer addresses to upper layer addresses."
    ],
    correctAnswers: [
      "Multicast transmission can be used by routers to exchange routing information.",
      "A single packet can be sent to a group of hosts."
    ], // Checkbox (2 correct answers)
    points: 5
  },
  {
    questionText: "Which three types of nodes should be assigned static IP addresses on a network?",
    choices: [
      "desktop PCs",
      "printers",
      "mobile laptops",
      "gateways",
      "tablets",
      "servers"
    ],
    correctAnswers: [
      "printers",
      "gateways",
      "servers"
    ], // Checkbox (3 correct answers)
    points: 5
  },
  {
    questionText: "What benefit does DHCP provide to a network?",
    choices: [
      "DHCP allows users to refer to locations by a name rather than an IP address.",
      "Hosts always have the same IP address and are therefore always reachable.",
      "Hosts can connect to the network and get an IP address without manual configuration.",
      "Duplicate addresses cannot occur on a network that issues dynamic addresses using DHCP and has static assignments."
    ],
    correctAnswers: ["Hosts can connect to the network and get an IP address without manual configuration."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which three addresses are valid public addresses?",
    choices: [
      "198.133.219.17",
      "128.107.12.117",
      "172.31.1.25",
      "10.15.250.5",
      "64.104.78.227",
      "192.168.1.245"
    ],
    correctAnswers: [
      "198.133.219.17",
      "128.107.12.117",
      "64.104.78.227"
    ], // Checkbox (3 correct answers)
    points: 5
  },
  {
    questionText: "Which number grouping is a valid IPv6 address?",
    choices: [
      "1234:1230::1238::1299:1000::",
      "1b10::1100::2001::2900::ab11::1102::0000::2900",
      "2001:0db8:3c55:0015:1010:0000:abcd:ff13",
      "12aa::1298:1200::129b"
    ],
    correctAnswers: ["2001:0db8:3c55:0015:1010:0000:abcd:ff13"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What type of route is indicated by the code C in an IPv4 routing table on a Cisco router?",
    choices: [
      "directly connected route",
      "default route",
      "dynamic route learned from another router",
      "static route"
    ],
    correctAnswers: ["directly connected route"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A small accounting office is setting up a wireless network to connect end devices and to provide internet access. In which two scenarios does a wireless router perform Network Address Translation (NAT)?",
    choices: [
      "when a host is sending packets to the ISP in order to request a speed increase for Internet services",
      "when a host is sending packets to a local server in order to update the network media settings and music playlists",
      "when a host is sending packets to a remote site owned by the manufacturer of the wireless router in order to request a digital copy of the device manual",
      "when a host is sending a print job to a network printer on the LAN"
    ],
    correctAnswers: [
      "when a host is sending packets to the ISP in order to request a speed increase for Internet services",
      "when a host is sending packets to a remote site owned by the manufacturer of the wireless router in order to request a digital copy of the device manual"
    ], // Checkbox (2 correct answers)
    points: 5
  },
  {
    questionText: "A network administrator has a multi-floor LAN to monitor and maintain. Through careful monitoring, the administrator has noticed a large amount of broadcast traffic slowing the network. Which device would you use to best solve this problem?",
    choices: [
      "switch",
      "router",
      "host",
      "server"
    ],
    correctAnswers: ["router"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "An employee is having connectivity issues. Why might a network technician try to ping the default gateway from the employee laptop?",
    choices: [
      "to verify connectivity with the device that provides access to remote networks",
      "to verify that an IP address was provided by the DHCP server",
      "to determine if the laptop address is included in the DNS server",
      "to verify that the SVI interface on the switch is configured correctly"
    ],
    correctAnswers: ["to verify connectivity with the device that provides access to remote networks."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which command would a technician use to display network connections on a host computer?",
    choices: [
      "ipconfig",
      "nslookup",
      "tracert",
      "netstat"
    ],
    correctAnswers: ["netstat"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "How are port numbers used in the TCP/IP encapsulation process?",
    choices: [
      "Source port and destination port numbers are randomly generated.",
      "Source port numbers and destination port numbers are not necessary when UDP is the transport layer protocol being used for the communication.",
      "If multiple conversations occur that are using the same service, the source port number is used to track the separate conversations.",
      "Destination port numbers are assigned automatically and cannot be changed."
    ],
    correctAnswers: ["If multiple conversations occur that are using the same service, the source port number is used to track the separate conversations."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "When analog voice signals are converted for use on a computer network, in what format are they encapsulated?",
    choices: [
      "IP packets",
      "segments",
      "frames",
      "bits"
    ],
    correctAnswers: ["IP packets"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Two pings were issued from a host on a local network. The first ping was issued to the IP address of the default gateway of the host and it failed. The second ping was issued to the IP address of a host outside the local network and it was successful. What is a possible cause for the failed ping?",
    choices: [
      "The default gateway is not operational.",
      "The TCP/IP stack on the default gateway is not working properly.",
      "Security rules are applied to the default gateway device, preventing it from processing ping requests.",
      "The default gateway device is configured with the wrong IP address."
    ],
    correctAnswers: ["Security rules are applied to the default gateway device, preventing it from processing ping requests."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which wireless technology allows a customer to connect to a payment terminal in the store with a smartphone?",
    choices: [
      "Wi-Fi",
      "GPS",
      "NFC",
      "Bluetooth"
    ],
    correctAnswers: ["NFC"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "What are two methods typically used on a mobile device to provide internet connectivity?",
    choices: [
      "Bluetooth",
      "cellular",
      "NFC",
      "GPS",
      "Wi-Fi"
    ],
    correctAnswers: [
        "cellular",
        "Wi-Fi"
    ], // Checkbox (2 correct answers)
    points: 5
  },
  {
    questionText: "What information does an Ethernet switch examine and use to build its address table?",
    choices: [
      "destination IP address",
      "destination MAC address",
      "source IP address",
      "source MAC address"
    ],
    correctAnswers: ["source MAC address"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "Which two OSI model layers have the same functionality as two layers of the TCP/IP model?",
    choices: [
      "transport",
      "network",
      "data link",
      "session",
      "presentation" // Added 5th option for flexibility
    ],
    correctAnswers: [
      "transport",
      "network"
    ], // Checkbox (2 correct answers)
    points: 5
  },
  {
    questionText: "What is the shortest valid representation of the IPv6 address 2001:0DB8:0000:1470:0000:0000:0000:0200?",
    choices: [
      "2001:DB8::1470::200",
      "2001:0DB8:0:147::02",
      "2001:0DB8::1470:0:0:0:2",
      "2001:DB8:0:1470::200"
    ],
    correctAnswers: ["2001:DB8:0:1470::200"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A college has five campuses... Which two groupings were used to create this IP addressing scheme?",
    choices: [
      "personnel type",
      "device type",
      "geographic location",
      "department"
    ],
    correctAnswers: [
      "device type",
      "geographic location"
    ], // Checkbox (2 correct answers)
    points: 5
  },
  {
    questionText: "For what purpose are IPv4 addresses utilized?",
    choices: [
      "An IPv4 address is burned into the network card to uniquely identify a device.",
      "An IPv4 address is used to identify the number of IP networks available.​",
      "An IPv4 address is used to uniquely identify a device on an IP network.",
      "An IPv4 address is used to uniquely identify the application that requested the information from a remote device."
    ],
    correctAnswers: ["An IPv4 address is used to uniquely identify a device on an IP network."], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "A user is setting up a home wireless network. A global address is to be used in NAT translations for traffic flowing through the wireless router. How is this global address assigned?",
    choices: [
      "The wireless router will act as a DHCP client in order to receive global addressing from the ISP.",
      "The default gateway IP address of the LAN device is used as the global address for NAT translations through the wireless router.",
      "The network administrator will choose an available IP address from the LAN and configure the global addressing of the wireless router.",
      "The host devices will select an unused IP address on the LAN for performing NAT through the wireless router."
    ],
    correctAnswers: ["The wireless router will act as a DHCP client in order to receive global addressing from the ISP."], // Multiple Choice (1 correct answer)
    points: 5
  },
   {
    questionText: "How many bits are in an IPv4 address?",
    choices: [
      "32",
      "256",
      "128",
      "64"
    ],
    correctAnswers: ["32"], // Multiple Choice (1 correct answer)
    points: 5
  },
  {
    questionText: "When a host sends a packet, how does it determine if the destination of the packet is on the same local network or on a remote network?",
    choices: [
      "It compares the source and destination MAC addresses.",
      "It queries the DNS server with the destination IP address.",
      "It checks to see if the default gateway is configured.",
      "It uses the subnet mask to compare the source and destination IP address."
    ],
    correctAnswers: ["It uses the subnet mask to compare the source and destination IP address."], // Multiple Choice (1 correct answer)
    points: 5
  },
   {
    questionText: "Which network security testing tool is well-known for scanning systems to identify software vulnerabilities and misconfigurations?",
    choices: [
      "Nessus",
      "Tripwire",
      "Nmap",
      "Wireshark"
    ],
    correctAnswers: ["Nessus"], // Multiple Choice
    points: 5
  },
  {
    questionText: "Which network security testing tool is primarily used for network discovery, host identification, and Layer 3/4 port scanning?",
    choices: [
      "Nmap",
      "Nessus",
      "Tripwire",
      "Aircrack-ng"
    ],
    correctAnswers: ["Nmap"], // Multiple Choice
    points: 5
  },
   {
    questionText: "What network security testing tool is primarily used to assess if network device configurations are compliant with established security policies by checking for unauthorized changes?",
    choices: [
      "Tripwire",
      "Nessus",
      "Nmap",
      "Metasploit"
    ],
    correctAnswers: ["Tripwire"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What network security testing tool has the ability to aggregate log data and provide details on the source of suspicious network activity?",
    choices: [
      "SIEM (Security Information and Event Management)",
      "Nessus",
      "Aircrack-ng",
      "John the Ripper"
    ],
    correctAnswers: ["SIEM (Security Information and Event Management)"], // Multiple Choice
    points: 5
  },
  {
    questionText: "What is a key goal of network penetration testing?",
    choices: [
      "Determining the feasibility of an attack and the potential consequences of a successful breach.",
      "Continuously monitoring network traffic for anomalies.",
      "Ensuring all systems are patched and up-to-date.",
      "Cataloging all assets on the network."
    ],
    correctAnswers: ["Determining the feasibility of an attack and the potential consequences of a successful breach."], // Multiple Choice
    points: 5
  }
];


// --- SCRIPT CORE LOGIC (Generally no need to edit below this line) --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Global variables for script operation
var _currentQuizFormGlobal = null;
var _currentQuizTitleGlobal = "";
var _currentQuizFormIdGlobal = null;

/**
 * Fisher-Yates (aka Knuth) Shuffle
 * Shuffles array in place.
 * @param {Array} array The array to shuffle.
 * @returns {Array} The shuffled array (the same array object).
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements using destructuring assignment
  }
  return array;
}


function _tryShowAlert(title, message) {
  try {
    // Check if script is bound to a Spreadsheet, Doc, or Form that has a UI
    var ui = null;
    if (typeof SpreadsheetApp !== 'undefined' && SpreadsheetApp.getUi) {
      ui = SpreadsheetApp.getUi();
    } else if (typeof DocumentApp !== 'undefined' && DocumentApp.getUi) {
       ui = DocumentApp.getUi();
    } else if (typeof FormApp !== 'undefined' && FormApp.getUi) {
       ui = FormApp.getUi();
    }

    if (ui) {
        ui.alert(title, message, ui.ButtonSet.OK);
    } else { Logger.log("UI Alert Skipped (No UI context): Title: " + title + ", Message: " + message); }

  } catch (e) { Logger.log("Error trying to show UI alert: " + e.toString() + ". Alert Title: " + title + ", Message: " + message); }
}

function _initializeNewQuizProcess(title, description, targetFolderName) {
  Logger.log("--- _initializeNewQuizProcess ---");
  Logger.log("Attempting to start quiz with title: '" + title + "'");
  if (typeof title !== 'string' || title.trim() === "") {
    const err = "Invalid title for quiz. Must be non-empty string."; Logger.log("ERROR: " + err); _tryShowAlert("Init Error", err); throw new Error(err);
  }

  try {
    _currentQuizFormGlobal = FormApp.create(title);
    _currentQuizFormGlobal.setIsQuiz(true);
    _currentQuizFormGlobal.setDescription(description);
    _currentQuizFormGlobal.setCollectEmail(false); // Set to true if you need emails
    _currentQuizFormGlobal.setProgressBar(true); // Show progress bar
    _currentQuizFormGlobal.setShuffleQuestions(false); // Set to true if you want QUESTIONS shuffled across pages

    _currentQuizTitleGlobal = title;
    _currentQuizFormIdGlobal = _currentQuizFormGlobal.getId();
    Logger.log('Quiz "' + title + '" initialized successfully with ID: ' + _currentQuizFormIdGlobal);

    if (targetFolderName && typeof targetFolderName === 'string' && targetFolderName.trim() !== "") {
      try {
        // Check if DriveApp scope is available
        if (typeof DriveApp === 'undefined') {
             Logger.log("DRIVE ERROR: DriveApp service not available. Cannot move form. Form will remain in root.");
             _tryShowAlert("Drive Operation Warning", "DriveApp service not available. Cannot move quiz to '" + targetFolderName + "'. Form will remain in root.");
        } else {
             var formFile = DriveApp.getFileById(_currentQuizFormIdGlobal);
             var folders = DriveApp.getFoldersByName(targetFolderName);
             var targetFolder = folders.hasNext() ? folders.next() : DriveApp.getRootFolder().createFolder(targetFolderName);
             if (!folders.hasNext()) Logger.log("Created new folder: '" + targetFolderName + "' with ID: " + targetFolder.getId());
             else Logger.log("Found existing folder: '" + targetFolderName + "' with ID: " + targetFolder.getId());
             formFile.moveTo(targetFolder);
             Logger.log("Moved form '" + title + "' to folder '" + targetFolderName + "'.");
        }
      } catch (driveError) {
        Logger.log("DRIVE ERROR: Could not move form to folder '" + targetFolderName + "'. " + driveError.toString() + "\nForm ID: " + _currentQuizFormIdGlobal + ". Form will remain in root.");
        _tryShowAlert("Drive Operation Warning", "Could not move quiz to '" + targetFolderName + "'. Check permissions/move manually. Quiz created.\nError: " + driveError.message);
      }
    } else {
      Logger.log("No target folder specified or invalid; form remains in root of My Drive.");
    }
  } catch (e) {
    const errorMessage = "Error in _initializeNewQuizProcess: " + e.toString();
    Logger.log("ERROR: " + errorMessage + "\nStack: " + e.stack); _tryShowAlert("Quiz Creation Error", errorMessage); throw e;
  }
}

function _addQuestionToCurrentQuiz(questionData) {
  Logger.log("--- _addQuestionToCurrentQuiz --- Processing Question: '" + questionData.questionText.substring(0, 50) + "...'");
  if (!_currentQuizFormGlobal) { throw new Error("Quiz not initialized."); }

  const { questionText, choices, correctAnswers, points } = questionData;

  // --- Data Validation ---
  if (typeof questionText !== 'string' || questionText.trim() === "") { Logger.log("Skipping question due to empty question text: " + JSON.stringify(questionData)); return; }
  if (!Array.isArray(choices) || choices.length < 2) { Logger.log("Skipping question '" + questionText + "' due to invalid choices array (must have at least 2 options)."); return; }
  if (choices.some(opt => typeof opt !== 'string' || opt.trim() === "")) { Logger.log("Skipping question '" + questionText + "' as one or more choices are empty/not strings."); return; }
  if (!Array.isArray(correctAnswers) || correctAnswers.length === 0) { Logger.log("Skipping question '" + questionText + "' due to invalid correctAnswers array (must have at least one correct answer)."); return; }
   if (correctAnswers.some(ans => typeof ans !== 'string' || ans.trim() === "")) { Logger.log("Skipping question '" + questionText + "' as one or more correct answers are empty/not strings."); return; }
  // Verify all correct answers are present in choices
  for (const correct of correctAnswers) {
      if (!choices.includes(correct)) {
          Logger.log("Skipping question '" + questionText + "': Correct answer '" + correct + "' not found in choices: " + choices.join(" | "));
          return; // Skip the whole question if any correct answer is missing from choices
      }
  }
  var parsedPoints = parseInt(points);
  if (isNaN(parsedPoints) || parsedPoints < 0) { Logger.log("Skipping question '" + questionText + "' due to invalid points: " + points); return; }
  // --- End Data Validation ---


  try {
    let item;
    let itemChoices;

    // Determine question type based on the number of correct answers
    if (correctAnswers.length === 1) {
        // Multiple Choice
        item = _currentQuizFormGlobal.addMultipleChoiceItem();
        // SHUFFLE the choices for Multiple Choice
        const shuffledChoices = shuffleArray([...choices]); // Shuffle a copy
         itemChoices = shuffledChoices.map(opt => item.createChoice(opt, opt === correctAnswers[0]));

         // Feedback for MC
         item.setFeedbackForCorrect(FormApp.createFeedback().setText("Correct!").build());
         item.setFeedbackForIncorrect(FormApp.createFeedback().setText("The correct answer was: " + correctAnswers[0]).build());

    } else {
        // Checkbox
        item = _currentQuizFormGlobal.addCheckboxItem();
        // SHUFFLE the choices for Checkbox
        const shuffledChoices = shuffleArray([...choices]); // Shuffle a copy
        itemChoices = shuffledChoices.map(opt => item.createChoice(opt, correctAnswers.includes(opt)));

        // Feedback for Checkbox
        item.setFeedbackForCorrect(FormApp.createFeedback().setText("Correct!").build());
        item.setFeedbackForIncorrect(FormApp.createFeedback().setText("The correct answers were: " + correctAnswers.join(", ")).build());

    }

    item.setTitle(questionText);
    item.setPoints(parsedPoints);
    item.setRequired(true);
    item.setChoices(itemChoices);

    Logger.log('Successfully added question: "' + questionText.substring(0, 50) + '..." (Type: ' + (correctAnswers.length === 1 ? 'Multiple Choice' : 'Checkbox') + ', Shuffled Options)');

  } catch (e) {
    // Log the error but do not re-throw, to allow other questions to be processed.
    Logger.log("ERROR adding question '" + questionText.substring(0, 50) + "...': " + e.toString() + "\nStack: " + e.stack);
    _tryShowAlert("Question Add Error", "Error adding question: " + questionText.substring(0,50) + "...\n" + e.message);
  }
}

function _finalizeAndPublishQuiz(confirmationMessage) {
  Logger.log("--- _finalizeAndPublishQuiz ---");
  if (!_currentQuizFormIdGlobal) {
      const noIdError = "Error: Quiz Form ID is not available. Cannot finalize.";
      Logger.log(noIdError); _tryShowAlert("Quiz Finalize Error", noIdError); throw new Error(noIdError);
  }

  try {
    Logger.log("Attempting to open form by ID for finalization: " + _currentQuizFormIdGlobal);
    var formToFinalize = FormApp.openById(_currentQuizFormIdGlobal);
    if (!formToFinalize) {
        const openError = "Error: Could not open form by ID '" + _currentQuizFormIdGlobal + "' for finalization.";
        Logger.log(openError); _tryShowAlert("Quiz Finalize Error", openError); throw new Error(openError);
    }

    formToFinalize.setConfirmationMessage(confirmationMessage);

    // Setting Quiz Settings (Feedback display options)
    // Use explicit reference to FormApp service
    if (typeof FormApp.QuizSettings === 'undefined' || typeof FormApp.QuizSettings.newBuilder !== 'function') {
        const serviceError = "WARNING: FormApp.QuizSettings API not fully available or newBuilder function is missing. Cannot set detailed quiz settings.";
        Logger.log(serviceError);
        // Optionally, add a basic alert if UI is available
         _tryShowAlert("Quiz Settings Warning", serviceError + "\nBasic quiz settings will be used.");
        // Continue without setting detailed QuizSettings
    } else {
         Logger.log("FormApp.QuizSettings.newBuilder seems available for form ID: " + formToFinalize.getId());
         var quizSettingsBuilder = FormApp.QuizSettings.newBuilder();
         var quizSettings = quizSettingsBuilder
             .setSeeCorrectAnswers(true)
             .setSeeMissedQuestions(true)
             .setSeePointValues(true)
             .build();
         formToFinalize.setQuizSettings(quizSettings);
         Logger.log("Detailed quiz settings applied to form ID: " + _currentQuizFormIdGlobal);
    }


    var publishedUrl = formToFinalize.getPublishedUrl();
    var editUrl = formToFinalize.getEditUrl();
    Logger.log('Quiz "' + _currentQuizTitleGlobal + '" finalized! Published: ' + publishedUrl + " Edit: " + editUrl);

    // Display links in a modal dialog if running as a bound script with UI
    try {
        if (typeof HtmlService !== 'undefined') {
            var ui = (typeof SpreadsheetApp !== 'undefined' && SpreadsheetApp.getUi) ? SpreadsheetApp.getUi() :
                     (typeof DocumentApp !== 'undefined' && DocumentApp.getUi) ? DocumentApp.getUi() :
                      (typeof FormApp !== 'undefined' && FormApp.getUi) ? FormApp.getUi() :
                     null;

            if (ui && ui.showModalDialog) {
                 var messageHtml = `Quiz "<b>${_currentQuizTitleGlobal}</b>" created!<br/>View: <a href="${publishedUrl}" target="_blank">Open Quiz</a><br/>Edit: <a href="${editUrl}" target="_blank">Edit Form</a><br/><br/>Check the execution log for more details.`;
                 ui.showModalDialog(HtmlService.createHtmlOutput(messageHtml).setWidth(450).setHeight(180), 'Quiz Creation Complete!');
            } else {
                 Logger.log("Modal dialog skipped (no suitable UI or showModalDialog method).");
                 // If no modal, log the URLs prominently
                 Logger.log("\n--- Quiz URLs ---");
                 Logger.log("Published URL: " + publishedUrl);
                 Logger.log("Editor URL: " + editUrl);
                 Logger.log("-----------------\n");
            }
        } else Logger.log("HtmlService not available. Modal dialog skipped.");
    } catch(uiError) { Logger.log("Error showing modal or logging URLs: " + uiError); }

    // Clear global variables after successful finalization
    _currentQuizFormGlobal = null; _currentQuizTitleGlobal = ""; _currentQuizFormIdGlobal = null;
  } catch (e) {
    const errorMessage = "Error in _finalizeAndPublishQuiz: " + e.toString();
    Logger.log("ERROR: " + errorMessage + "\nStack: " + e.stack); _tryShowAlert("Quiz Finalize Error", errorMessage); throw e;
  } finally {
      // Ensure globals are reset even if trashing failed
      _currentQuizFormGlobal = null; _currentQuizTitleGlobal = ""; _currentQuizFormIdGlobal = null;
  }
}

/**
 * MAIN FUNCTION TO RUN: Creates a quiz from the QUIZ_DATA array defined in this script.
 */
function createQuizFromInternalData() {
  Logger.log("===== Starting createQuizFromInternalData =====");
  try {
    if (typeof QUIZ_TITLE !== 'string' || QUIZ_TITLE.trim() === '') {
        const titleError = "Configuration Error: QUIZ_TITLE is not defined or empty."; Logger.log("ERROR: " + titleError); _tryShowAlert("Config Error", titleError); throw new Error(titleError);
    }
    if (!Array.isArray(QUIZ_DATA) || QUIZ_DATA.length === 0) {
        const dataError = "Configuration Error: QUIZ_DATA array is empty or not an array."; Logger.log("ERROR: " + dataError); _tryShowAlert("Config Error", dataError); throw new Error(dataError);
    }

    Logger.log("Using Quiz Title: '" + QUIZ_TITLE + "'");
    _initializeNewQuizProcess(QUIZ_TITLE, QUIZ_DESCRIPTION, TARGET_DRIVE_FOLDER_NAME);

    if (!_currentQuizFormGlobal) {
         Logger.log("Quiz initialization failed. Exiting.");
         return; // Initialization failed, stop here.
    }

    Logger.log("Processing " + QUIZ_DATA.length + " questions...");
    // Process questions. We iterate through a copy of the array in case processing
    // a question modifies the array structure in an unexpected way (though it shouldn't).
    // Also, the shuffleArray in _addQuestionToCurrentQuiz modifies the choices array
    // *within* the original QUIZ_DATA objects if we pass them directly. If you needed
    // the original QUIZ_DATA pristine for other purposes, you would pass a deep copy.
    // For this script's use case, modifying in place is fine.
    for (var i = 0; i < QUIZ_DATA.length; i++) {
       _addQuestionToCurrentQuiz(QUIZ_DATA[i]);
    }

    // Re-open form by ID to get the latest state including added items
    var formAfterAddingItems = _currentQuizFormIdGlobal ? FormApp.openById(_currentQuizFormIdGlobal) : null;

    if (!formAfterAddingItems || formAfterAddingItems.getItems().length === 0) {
        const noQuestionsAddedError = "No valid questions were successfully added to the quiz. Check QUIZ_DATA and logs.";
        Logger.log("ERROR: " + noQuestionsAddedError);
        _tryShowAlert("Quiz Creation Warning", noQuestionsAddedError);
        // Attempt to trash the empty form if it was created
        if (_currentQuizFormIdGlobal) {
            try { DriveApp.getFileById(_currentQuizFormIdGlobal).setTrashed(true); Logger.log("Empty quiz form " + _currentQuizFormIdGlobal + " trashed."); }
            catch(eTrash){ Logger.log("Could not trash empty form " + _currentQuizFormIdGlobal + ": " + eTrash); }
        }
        return; // Stop if no questions were actually added
    }

    _finalizeAndPublishQuiz("You have completed the quiz '" + QUIZ_TITLE + "'! Check your results.");
    Logger.log("===== createQuizFromInternalData completed successfully. =====");

  } catch (e) {
    Logger.log("===== CRITICAL ERROR in createQuizFromInternalData: " + e.toString() + " =====" + "\nStack: " + e.stack);
    _tryShowAlert("Overall Quiz Creation Failed", "A critical error occurred during quiz creation. Check logs for details." + "\nError: " + e.message);
    // Clean up any partial form if a critical error occurred mid-process
     if (_currentQuizFormIdGlobal) {
         try { DriveApp.getFileById(_currentQuizFormIdGlobal).setTrashed(true); Logger.log("Partial quiz form " + _currentQuizFormIdGlobal + " trashed due to critical error."); }
         catch(eTrash){ Logger.log("Could not trash partial form " + _currentQuizFormIdGlobal + ": " + eTrash); }
     }
  } finally {
      // Ensure globals are reset even if trashing failed
      _currentQuizFormGlobal = null; _currentQuizTitleGlobal = ""; _currentQuizFormIdGlobal = null;
  }
}