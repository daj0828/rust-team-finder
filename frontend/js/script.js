const BASE_URL = 'http://localhost:5000';

document.addEventListener("DOMContentLoaded", () => {
  const userJson = localStorage.getItem("token");
  if (!userJson) {
    alert("로그인 후 이용해주세요!");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("writeSection").style.display = "block";
  displayPosts();
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  window.location.href = "login.html";
}

async function submitPost(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();

  if (!title || !content) return;

  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // if using auth middleware
    },
    body: JSON.stringify({
      title,
      content,
      nickname: user.nickname,
      discord: user.discord
    })
  });

  if (res.ok) {
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    displayPosts();
  }
}

async function displayPosts() {
  const res = await fetch(`${BASE_URL}/api/posts`);
  const posts = await res.json();
  const postList = document.getElementById("postList");
  postList.innerHTML = posts.map(post => `
    <div class="post">
      <div class="post-header">
        <h3>${post.title}</h3>
        <span class="author">${post.nickname} (${post.discord})</span>
      </div>
      <p class="content">${post.content}</p>
      <div class="timestamp">${new Date(post.timestamp).toLocaleString()}</div>
    </div>
  `).join('');
}
