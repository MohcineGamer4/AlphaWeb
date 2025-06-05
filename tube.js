// Handle comment submission
document.getElementById('comment-submit').addEventListener('click', function() {
    const commentInput = document.getElementById('comment-input');
    const text = commentInput.value.trim();
    
    if (text) {
        const commentList = document.getElementById('comment-list');
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <div class="comment-avatar"></div>
            <div class="comment-content">
                <div class="comment-author">Anonymous</div>
                <div class="comment-text">${text}</div>
            </div>
        `;
        commentList.appendChild(newComment);
        commentInput.value = '';
    }
});