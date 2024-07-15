document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const countdownElement = document.getElementById("countdown");
    const scoreForm = document.getElementById("scoreForm");
    const saveScoreUrl = scoreForm.getAttribute("data-save-url");
    const highScoresUrl = scoreForm.getAttribute("data-high-scores-url");
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let snake, dx, dy, food, gameInterval, countdownTimeout;

    function initGame() {
        snake = [{ x: 300, y: 300 }];
        dx = 20;
        dy = 0;
        food = generateFood();
        document.getElementById("scoreForm").style.display = "none";
        document.getElementById("playAgain").style.display = "none";
        countdownElement.style.display = "block";
        startCountdown(3, startGame);
    }

    function startCountdown(seconds, callback) {
        countdownElement.textContent = seconds;
        countdownTimeout = setTimeout(() => {
            if (seconds > 1) {
                startCountdown(seconds - 1, callback);
            } else {
                countdownElement.style.display = "none";
                callback();
            }
        }, 1000);
    }

    function startGame() {
        gameInterval = setInterval(gameLoop, 200); // Increased interval for slower speed
    }

    function drawSnake() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "green";
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, 20, 20);
        });
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, 20, 20);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            food = generateFood();
        } else {
            snake.pop();
        }
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
            clearInterval(gameInterval);
            document.getElementById("scoreInput").value = snake.length;
            document.getElementById("scoreForm").style.display = "block";
            document.getElementById("playAgain").style.display = "block";
        }
    }

    function generateFood() {
        return { x: Math.floor(Math.random() * 30) * 20, y: Math.floor(Math.random() * 30) * 20 };
    }

    function gameLoop() {
        moveSnake();
        drawSnake();
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowUp" && dy === 0) {
            dx = 0;
            dy = -20;
        } else if (event.key === "ArrowDown" && dy === 0) {
            dx = 0;
            dy = 20;
        } else if (event.key === "ArrowLeft" && dx === 0) {
            dx = -20;
            dy = 0;
        } else if (event.key === "ArrowRight" && dx === 0) {
            dx = 20;
            dy = 0;
        }
    });

    document.getElementById("scoreForm").addEventListener("submit", function(event) {
        event.preventDefault();
        fetch(saveScoreUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken
            },
            body: new URLSearchParams(new FormData(this))
        }).then(response => response.json()).then(data => {
            if (data.status === "ok") {
                window.location.href = highScoresUrl;
            } else {
                alert("Failed to save score");
            }
        });
    });

    document.getElementById("playAgain").addEventListener("click", function() {
        clearTimeout(countdownTimeout);
        clearInterval(gameInterval);
        initGame();
    });

    initGame();
});
