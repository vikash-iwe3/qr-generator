document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Elements
    const qrInput = document.getElementById('qr-input');
    const fgColorInput = document.getElementById('fg-color');
    const bgColorInput = document.getElementById('bg-color');
    const fgLabel = document.getElementById('fg-label');
    const bgLabel = document.getElementById('bg-label');
    const ecButtons = document.querySelectorAll('#ec-level button');
    const qrcodeContainer = document.getElementById('qrcode');
    const qrcodePlaceholder = document.getElementById('qrcode-placeholder');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const historyList = document.getElementById('history-list');
    const emptyHistory = document.getElementById('empty-history');
    const clearHistoryBtn = document.getElementById('clear-history');
    const copyTextBtn = document.getElementById('copy-text-btn');

    const tabButtons = document.querySelectorAll('[data-tab]');
    const views = document.querySelectorAll('.view');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarDrawer = document.getElementById('sidebar-drawer');
    const closeDrawerBtn = document.querySelector('.close-btn');
    const drawerOverlay = document.querySelector('.drawer-overlay');

    // State
    let qrcode = null;
    let ecLevel = 'M';
    let history = JSON.parse(localStorage.getItem('qr-history') || '[]');

    // Functions
    const updateQR = () => {
        const text = qrInput.value.trim();

        if (!text) {
            qrcodeContainer.innerHTML = '';
            qrcodePlaceholder.style.display = 'flex';
            downloadBtn.disabled = true;
            shareBtn.disabled = true;
            return;
        }

        qrcodePlaceholder.style.display = 'none';
        qrcodeContainer.innerHTML = '';
        downloadBtn.disabled = false;
        shareBtn.disabled = false;

        const size = 256;

        qrcode = new QRCode(qrcodeContainer, {
            text: text,
            width: size,
            height: size,
            colorDark: fgColorInput.value,
            colorLight: bgColorInput.value,
            correctLevel: QRCode.CorrectLevel[ecLevel]
        });

        // Small delay to ensure QR is rendered
        setTimeout(() => {
            const img = qrcodeContainer.querySelector('img');
            if (img) img.style.display = 'block';
        }, 50);
    };

    const saveToHistory = () => {
        const text = qrInput.value.trim();
        if (!text) return;

        const newItem = {
            id: Date.now().toString(),
            value: text,
            date: new Date().toLocaleString(),
            fg: fgColorInput.value,
            bg: bgColorInput.value,
            ec: ecLevel
        };

        // Avoid duplicates in recent history
        if (history.length > 0 && history[0].value === text) return;

        history = [newItem, ...history].slice(0, 20);
        localStorage.setItem('qr-history', JSON.stringify(history));
        renderHistory();
    };

    const renderHistory = () => {
        historyList.innerHTML = '';
        if (history.length === 0) {
            emptyHistory.style.display = 'flex';
            clearHistoryBtn.style.display = 'none';
        } else {
            emptyHistory.style.display = 'none';
            clearHistoryBtn.style.display = 'flex';

            history.forEach(item => {
                const el = document.createElement('div');
                el.className = 'history-item';

                const qrContainer = document.createElement('div');
                qrContainer.className = 'history-item-qr';
                qrContainer.id = `hist-qr-${item.id}`;

                const infoContainer = document.createElement('div');
                infoContainer.className = 'history-item-info';

                const valueEl = document.createElement('div');
                valueEl.className = 'history-item-value';
                valueEl.textContent = item.value;

                const dateEl = document.createElement('div');
                dateEl.className = 'history-item-date';
                dateEl.textContent = item.date;

                infoContainer.appendChild(valueEl);
                infoContainer.appendChild(dateEl);

                el.appendChild(qrContainer);
                el.appendChild(infoContainer);

                el.addEventListener('click', () => {
                    qrInput.value = item.value;
                    fgColorInput.value = item.fg;
                    bgColorInput.value = item.bg;
                    fgLabel.textContent = item.fg.toUpperCase();
                    bgLabel.textContent = item.bg.toUpperCase();

                    if (item.ec) {
                        ecLevel = item.ec;
                        ecButtons.forEach(b => {
                            if (b.getAttribute('data-value') === item.ec) {
                                b.classList.add('active');
                            } else {
                                b.classList.remove('active');
                            }
                        });
                    }

                    switchTab('create');
                    updateQR();
                });

                historyList.appendChild(el);

                // Generate mini QR for history item
                new QRCode(document.getElementById(`hist-qr-${item.id}`), {
                    text: item.value,
                    width: 48,
                    height: 48,
                    colorDark: item.fg,
                    colorLight: item.bg
                });
            });
        }
    };

    const switchTab = (tabId) => {
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        views.forEach(view => {
            if (view.id === `${tabId}-view`) {
                view.style.display = 'block';
                setTimeout(() => view.classList.add('active'), 50);
            } else {
                view.classList.remove('active');
                setTimeout(() => {
                    if (!view.classList.contains('active')) view.style.display = 'none';
                }, 400);
            }
        });
    };

    const downloadPNG = () => {
        const img = qrcodeContainer.querySelector('img');
        if (!img) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 1024; // High res
        canvas.width = size;
        canvas.height = size;

        const qrImg = new Image();
        qrImg.onload = () => {
            ctx.fillStyle = bgColorInput.value;
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(qrImg, 0, 0, size, size);

            const link = document.createElement('a');
            link.download = `qr-code-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            saveToHistory();
        };
        qrImg.src = img.src;
    };

    // Event Listeners
    qrInput.addEventListener('input', updateQR);

    fgColorInput.addEventListener('input', (e) => {
        fgLabel.textContent = e.target.value.toUpperCase();
        updateQR();
    });

    bgColorInput.addEventListener('input', (e) => {
        bgLabel.textContent = e.target.value.toUpperCase();
        updateQR();
    });

    ecButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            ecButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            ecLevel = btn.getAttribute('data-value');
            updateQR();
        });
    });

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
    });

    downloadBtn.addEventListener('click', downloadPNG);

    shareBtn.addEventListener('click', async () => {
        const text = qrInput.value.trim();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'QR Code',
                    text: text,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            alert('Sharing not supported on this browser');
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Clear all history?')) {
            history = [];
            localStorage.removeItem('qr-history');
            renderHistory();
        }
    });

    copyTextBtn.addEventListener('click', () => {
        const text = qrInput.value.trim();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = copyTextBtn.innerHTML;
            copyTextBtn.innerHTML = '<i data-lucide="check"></i>';
            lucide.createIcons();
            setTimeout(() => {
                copyTextBtn.innerHTML = originalIcon;
                lucide.createIcons();
            }, 2000);
        });
    });

    menuToggle.addEventListener('click', () => sidebarDrawer.classList.add('active'));
    closeDrawerBtn.addEventListener('click', () => sidebarDrawer.classList.remove('active'));
    drawerOverlay.addEventListener('click', () => sidebarDrawer.classList.remove('active'));

    // Init
    renderHistory();
});
