document.addEventListener('DOMContentLoaded', function() {
    // Sample data for initial threads
    const sampleThreads = [
        {
            id: 1,
            name: "Rony",
            subject: "best OS for beginners",
            comment: "i prefer to you using linux mint because it's so easy for beginners",
            timestamp: new Date().toLocaleString(),
            image: null,
            replies: [
                {
                    name: "kazai",
                    comment: "no it's ubuntu",
                    timestamp: new Date().toLocaleString()
                },
                {
                    name: "Anonymous",
                    comment: "no one beat debian",
                    timestamp: new Date().toLocaleString()
                }
            ]
        },
        {
            id: 2,
            name: "TechGuy",
            subject: "Best programming language?",
            comment: "Fight in the comments. I say JavaScript.",
            timestamp: new Date().toLocaleString(),
            image: "https://via.placeholder.com/150",
            replies: [
                {
                    name: "PythonFan",
                    comment: "Python is clearly superior",
                    timestamp: new Date().toLocaleString()
                }
            ]
        },
        {
            id: 3,
            name: "Anonymous",
            subject: "",
            comment: "Just testing the board functionality",
            timestamp: new Date().toLocaleString(),
            image: null,
            replies: []
        }
    ];

    let threads = JSON.parse(localStorage.getItem('threads')) || sampleThreads;
    
    // DOM elements
    const newThreadBtn = document.getElementById('new-thread-btn');
    const threadForm = document.getElementById('thread-form');
    const postForm = document.getElementById('post-form');
    const threadsContainer = document.getElementById('threads-container');
    
    // Display all threads
    function displayThreads() {
        threadsContainer.innerHTML = '';
        
        threads.forEach(thread => {
            const threadElement = document.createElement('div');
            threadElement.className = 'thread';
            threadElement.dataset.id = thread.id;
            
            let threadHTML = `
                <div class="thread-title">${thread.subject || 'No subject'}</div>
                <div class="thread-meta">Posted by ${thread.name} • ${thread.timestamp}</div>
            `;
            
            if (thread.image) {
                threadHTML += `<img src="${thread.image}" class="thread-image" alt="Thread image">`;
            }
            
            threadHTML += `
                <div class="thread-preview">${thread.comment}</div>
                <div class="thread-meta">${thread.replies.length} replies</div>
            `;
            
            threadElement.innerHTML = threadHTML;
            threadsContainer.appendChild(threadElement);
            
            // Add click event to view thread
            threadElement.addEventListener('click', function() {
                viewThread(thread.id);
            });
        });
    }
    
    // View a single thread
    function viewThread(threadId) {
        const thread = threads.find(t => t.id == threadId);
        if (!thread) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'thread-modal';
        
        let modalHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div class="thread">
                    <div class="thread-title">${thread.subject || 'No subject'}</div>
                    <div class="thread-meta">Posted by ${thread.name} • ${thread.timestamp}</div>
        `;
        
        if (thread.image) {
            modalHTML += `<img src="${thread.image}" class="thread-image" alt="Thread image">`;
        }
        
        modalHTML += `
                    <div class="thread-content">${thread.comment}</div>
                </div>
                
                <div class="replies-container">
                    <h3>Replies (${thread.replies.length})</h3>
        `;
        
        thread.replies.forEach(reply => {
            modalHTML += `
                <div class="reply">
                    <div class="reply-meta">Posted by ${reply.name} • ${reply.timestamp}</div>
                    <div class="reply-content">${reply.comment}</div>
                </div>
            `;
        });
        
        modalHTML += `
                </div>
                
                <div class="reply-form">
                    <h3>Post a Reply</h3>
                    <form id="reply-form">
                        <div class="form-group">
                            <label for="reply-name">Name</label>
                            <input type="text" id="reply-name" placeholder="Anonymous">
                        </div>
                        <div class="form-group">
                            <label for="reply-comment">Comment</label>
                            <textarea id="reply-comment" rows="4" required></textarea>
                        </div>
                        <button type="submit">Reply</button>
                    </form>
                </div>
            </div>
        `;
        
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close modal
        modal.querySelector('.close-btn').addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });
        
        // Reply form submission
        const replyForm = modal.querySelector('#reply-form');
        replyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reply-name').value || 'Anonymous';
            const comment = document.getElementById('reply-comment').value;
            
            if (!comment) return;
            
            const newReply = {
                name,
                comment,
                timestamp: new Date().toLocaleString()
            };
            
            thread.replies.push(newReply);
            saveThreads();
            viewThread(threadId); // Refresh the view
            
            // Clear form
            document.getElementById('reply-comment').value = '';
        });
    }
    
    // Save threads to localStorage
    function saveThreads() {
        localStorage.setItem('threads', JSON.stringify(threads));
    }
    
    // Toggle new thread form
    newThreadBtn.addEventListener('click', function() {
        threadForm.style.display = threadForm.style.display === 'none' ? 'block' : 'none';
    });
    
    // Handle new thread submission
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value || 'Anonymous';
        const subject = document.getElementById('subject').value;
        const comment = document.getElementById('comment').value;
        const imageInput = document.getElementById('image');
        
        if (!comment) return;
        
        // Handle image upload (simplified - in a real app you'd upload to a server)
        let image = null;
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                image = e.target.result;
                createThread(name, subject, comment, image);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            createThread(name, subject, comment, image);
        }
    });
    
    function createThread(name, subject, comment, image) {
        const newThread = {
            id: threads.length > 0 ? Math.max(...threads.map(t => t.id)) + 1 : 1,
            name,
            subject,
            comment,
            timestamp: new Date().toLocaleString(),
            image,
            replies: []
        };
        
        threads.unshift(newThread); // Add to beginning of array
        saveThreads();
        displayThreads();
        
        // Reset form
        postForm.reset();
        threadForm.style.display = 'none';
    }
    
    // Initialize the page
    displayThreads();
// Settings dropdown functionality
const settingsBtn = document.getElementById('settings-btn');
const settingsDropdown = document.getElementById('settings-dropdown');

settingsBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    settingsDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
window.addEventListener('click', function() {
    if (settingsDropdown.classList.contains('show')) {
        settingsDropdown.classList.remove('show');
    }
});

// Clear data functionality
document.getElementById('clear-data-btn').addEventListener('click', function() {
    if (confirm('Are you sure ? this operation cannot be cancelled')) {
        localStorage.clear();
        threads = [];
        saveThreads();
        displayThreads();
        alert('All data has been cleared.');
    }
    settingsDropdown.classList.remove('show');
});

// Support modal
const supportModal = document.createElement('div');
supportModal.className = 'info-modal';
supportModal.id = 'support-modal';
supportModal.innerHTML = `
    <div class="info-modal-content">
        <span class="close-info-modal">&times;</span>
        <h3>Support</h3>
        <p>Having trouble with the site? Here's how to get help:</p>
        <ul>
            <li>Email: mohcinetheking4@gmail.com</li>
            <li>Discord: @seriouscorolo</li>
            <li>Phone Number: +212 694203109 </li>
        </ul>
    </div>
`;
document.body.appendChild(supportModal);

document.getElementById('support-btn').addEventListener('click', function() {
    document.getElementById('support-modal').style.display = 'block';
    settingsDropdown.classList.remove('show');
});

// Donation modal
const donationModal = document.createElement('div');
donationModal.className = 'info-modal';
donationModal.id = 'donation-modal';
donationModal.innerHTML = `
    <div class="info-modal-content">
        <span class="close-info-modal">&times;</span>
        <h3>Donate</h3>
        <p>If you enjoy SimpleChan, consider supporting us!</p>
        <div class="donation-options">
            <p><strong>Bitcoin:</strong> 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>
            <p><strong>PayPal:</strong> donate@simplechan.example</p>
            <p><strong>Patreon:</strong> patreon.com/simplechan</p>
        </div>
        <p>Thank you for your support! ❤️</p>
    </div>
`;
document.body.appendChild(donationModal);

document.getElementById('donation-btn').addEventListener('click', function() {
    document.getElementById('donation-modal').style.display = 'block';
    settingsDropdown.classList.remove('show');
});

// Close modals
document.querySelectorAll('.close-info-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.info-modal').style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.className === 'info-modal') {
        event.target.style.display = 'none';
    }
});
});
// Simple auth system
let currentUser = null;

// Toggle auth form
document.getElementById('auth-toggle').addEventListener('click', function() {
    const form = document.getElementById('auth-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

// Login function
document.getElementById('login-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById('auth-toggle').textContent = `👤 ${username}`;
        document.getElementById('auth-form').style.display = 'none';
        document.getElementById('auth-message').textContent = '';
    } else {
        document.getElementById('auth-message').textContent = 'Invalid login';
    }
});

// Signup function
document.getElementById('signup-btn').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username.length < 3) {
        document.getElementById('auth-message').textContent = 'Username too short';
        return;
    }
    
    if (password.length < 4) {
        document.getElementById('auth-message').textContent = 'Password too short';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        document.getElementById('auth-message').textContent = 'Username taken';
    } else {
        users[username] = { password: password };
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = username;
        document.getElementById('auth-toggle').textContent = `👤 ${username}`;
        document.getElementById('auth-form').style.display = 'none';
        document.getElementById('auth-message').textContent = '';
    }
});

// Modify post creation to use username
function createThread(boardId, name, subject, comment, image) {
    const authorName = currentUser || name || 'Anonymous';
    // ... rest of your existing createThread code ...
}