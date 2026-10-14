const boxBird = document.querySelector('.home__clip');
const initialPosition = boxBird.style.transform;
boxBird.addEventListener('mouseenter', function(event) {
    const box = event.target.getBoundingClientRect();
    const mouseX = event.clientX - box.left; // X position within the element
    const mouseY = event.clientY - box.top;  // Y position within the element
    const width = box.width;
    const height = box.height;
    const left = Math.abs(mouseX);
    const right = Math.abs(mouseX - width);
    const top = Math.abs(mouseY);
    const bottom = Math.abs(mouseY - height);
    const min = Math.min(left, right, top, bottom);
    if (min === left) {
        boxBird.style.transform = 'translate(400px, -600px)';
    } else if (min === right) {
        boxBird.style.transform = 'translate(-600px, -600px)';
    } else if (min === top) {
        boxBird.style.transform =' translate(400px, 600px)';
    } else if (min === bottom) {
        boxBird.style.transform = 'translate(-100px, -600px)';
    }
});
boxBird.addEventListener('click', function(event) {
    boxBird.style.opacity = 0;
    boxBird.style.rotate = '180deg';
    setInterval(checkClick, 5000);
})

function checkHover() {
    const isHovered = boxBird.parentElement.querySelector(':hover') === boxBird;
    if (!isHovered) {
        boxBird.style.transform = initialPosition;
    }
}
function checkClick() {
    boxBird.style.opacity = 1;
    boxBird.style.rotate = '0deg';
}
setInterval(checkHover, 500);

// Bỏ Chữ NCH gắn liền
const textStrong = document.querySelector('.strong-primary');
function checkScreenSize() {
    if (window.innerWidth < 739) {
        textStrong.innerHTML = 'Nguyen&nbsp;Cong Hau\'s';
    }
}
checkScreenSize();  // Kiểm tra ngay khi trang được tải

window.addEventListener('resize', checkScreenSize); // Kiểm tra mỗi khi cửa sổ được thay đổi kích thước

// Chặn Kiểm tra trình duyệt
document.addEventListener('contextmenu', function(event) { // Click chuột phải
    event.preventDefault();     
});
window.addEventListener('keydown', function(event) {
    if (event.keyCode === 123 ||
        event.keyCode === 85 ||
        event.keyCode === 73 ||
        event.keyCode === 74 ||
        event.keyCode === 67) 
    { // F12 U I J C
        event.preventDefault();
    }
});

// Light Mode & Dark Mode with LocalStorage persistence
const htmlWeb = document.documentElement;

function switchTheme(theme) {
    if (theme === 'light') {
        htmlWeb.classList.add('light');
        try {
            localStorage.setItem('portfolio-theme', 'light');
        } catch (e) {}
    } else {
        htmlWeb.classList.remove('light');
        try {
            localStorage.setItem('portfolio-theme', 'dark');
        } catch (e) {}
    }
}

document.querySelectorAll('.icon-light').forEach(function(lightElem) {
    lightElem.addEventListener('click', function(e) {
        e.stopPropagation();
        switchTheme('light');
    });
});

document.querySelectorAll('.icon-dark').forEach(function(darkElem) {
    darkElem.addEventListener('click', function(e) {
        e.stopPropagation();
        switchTheme('dark');
    });
});

document.querySelectorAll('.light--mode').forEach(function(wrapper) {
    wrapper.addEventListener('click', function() {
        if (htmlWeb.classList.contains('light')) {
            switchTheme('dark');
        } else {
            switchTheme('light');
        }
    });
});
