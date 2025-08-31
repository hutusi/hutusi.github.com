document.addEventListener("DOMContentLoaded", function () {
    const commentsContainer = document.getElementById("comments-link");
	
    if (!commentsContainer) return;

    // 获取当前文章的 slug（去掉 site URL 和 .html）
    const currentSlug = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');

    // 获取评论数和 Discussions 主题编号
	// 通过 AJAX 获取 JSON 数据
    fetch("/assets/data/comments.json?ts=" + Date.now())
        .then(response => response.json())
        .then(commentsData => {
            if (commentsData[currentSlug]) {
                const commentCount = commentsData[currentSlug];
                // 更新页面内容
                commentsContainer.innerHTML = `💬 ${commentCount} 条评论`;
            } else {
                commentsContainer.innerHTML = `💬 暂无评论`;
            }
        })
        .catch(error => {
            console.error("获取评论数据失败:", error);
			commentsContainer.innerHTML = `💬 评论加载失败`;
        });
});
