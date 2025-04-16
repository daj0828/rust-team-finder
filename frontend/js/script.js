// 로그인 확인
document.addEventListener("DOMContentLoaded", () => {
  const userJson = localStorage.getItem("loggedInUser");
  if (!userJson) {
    alert("로그인 후 이용해주세요!");
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(userJson);
  if (!user || !user.username) {
    alert("로그인 정보가 잘못되었습니다.");
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("writeSection").style.display = "block";
  displayPosts();
});

// 로그아웃
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// 글 작성
function submitPost(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) return;

  const newPost = {
    id: Date.now(),
    title,
    content,
    nickname: user.nickname,
    discord: user.discord,
    timestamp: new Date().toLocaleString(),
    comments: [],
    likes: [],
  };

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  displayPosts();
}

// 하트(좋아요) 토글
function toggleLike(postId) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return;

  const likes = posts[index].likes || [];
  const alreadyLiked = likes.includes(user.username);

  if (alreadyLiked) {
    posts[index].likes = likes.filter(u => u !== user.username);
  } else {
    posts[index].likes.push(user.username);
  }

  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}

// 게시글 표시
function displayPosts() {
  const postList = document.getElementById("postList");
  if (!postList) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  postList.innerHTML = posts.map(post => {
    const liked = post.likes && post.likes.includes(user.username);
    const heartClass = liked ? "liked" : "";
    const likeCount = post.likes ? post.likes.length : 0;

    return `
      <div class="post">
        <div class="post-header">
          <h3>${post.title}</h3>
          <span class="author">${post.nickname} (${post.discord})</span>
        </div>
        <p class="content">${post.content}</p>
        <div class="timestamp">${post.timestamp}</div>

        <div class="like-section">
          <button class="heart-btn ${heartClass}" onclick="toggleLike(${post.id})">
            ❤️ ${likeCount}
          </button>
        </div>

        <div class="comment-section">
          <h4>댓글</h4>
          <div class="comment-list" id="comments-${post.id}">
            ${post.comments.map(c => `
              <div class="comment"><strong>${c.nickname}</strong>: ${c.text}</div>
            `).join("")}
          </div>

          <form onsubmit="addComment(event, ${post.id})">
            <input type="text" id="comment-${post.id}" placeholder="댓글을 입력하세요" required />
            <button type="submit">댓글 작성</button>
          </form>
        </div>
      </div>
    `;
  }).join("");
}

// 댓글 작성
function addComment(event, postId) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const input = document.getElementById(`comment-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex(p => p.id === postId);
  if (index === -1) return;

  posts[index].comments.push({ nickname: user.nickname, text });
  localStorage.setItem("posts", JSON.stringify(posts));
  displayPosts();
}
