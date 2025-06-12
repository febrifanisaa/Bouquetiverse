    document.addEventListener('DOMContentLoaded', function() {  
    // Tambahkan listener untuk status koneksi internet
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Connection status indicator
    const connectionStatusEl = document.getElementById('connectionStatus');
    
    // Check database connection
    checkDatabaseConnection();
    
    // Function to check database connection
    function checkDatabaseConnection() {
        fetch('/api/connection-check')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'connected') {
                    console.log("Connected to database");
                    connectionStatusEl.textContent = "Terhubung ke server";
                    connectionStatusEl.className = "connection-status connection-online";
                    connectionStatusEl.style.display = "block";
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        connectionStatusEl.style.display = "none";
                    }, 3000);
                } else {
                    console.log("Not connected to database");
                    connectionStatusEl.textContent = "Tidak terhubung ke server";
                    connectionStatusEl.className = "connection-status connection-offline";
                    connectionStatusEl.style.display = "block";
                }
            })
            .catch(error => {
                console.error("Error checking connection:", error);
                connectionStatusEl.textContent = "Tidak terhubung ke server";
                connectionStatusEl.className = "connection-status connection-offline";
                connectionStatusEl.style.display = "block";
            });
    }
    
    // Update online/offline status
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;
        console.log("Internet connection:", isOnline ? "Online" : "Offline");
        
        if (!isOnline) {
            connectionStatusEl.textContent = "Tidak ada koneksi internet";
            connectionStatusEl.className = "connection-status connection-offline";
            connectionStatusEl.style.display = "block";
            
            // Disable buttons if offline
            document.querySelectorAll('.btn').forEach(btn => {
                if (btn.id === "sendMessageBtn" || btn.id === "submitOrderBtn") {
                    btn.disabled = true;
                }
            });
        } else {
            // Check database connection when back online
            checkDatabaseConnection();
            
            // Re-enable buttons if online
            document.querySelectorAll('.btn').forEach(btn => {
                if (btn.id === "sendMessageBtn" || btn.id === "submitOrderBtn") {
                    btn.disabled = false;
                }
            });
        }
    }
    
    // Check status immediately
    updateOnlineStatus();
    
    // Smooth scrolling  
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {  
        anchor.addEventListener('click', function(e) {  
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();  
            
            const targetId = this.getAttribute('href');  
            const targetElement = document.querySelector(targetId);  
            
            if (targetElement) {  
                window.scrollTo({  
                    top: targetElement.offsetTop - 100,  
                    behavior: 'smooth'  
                });  
            }  
        });  
    });  
    
    // Membuat elemen bunga tambahan  
    function createFlowers() {  
        for (let i = 0; i < 5; i++) {  
            const flower = document.createElement('div');  
            flower.className = 'floating-flower';  
            flower.style.top = Math.random() * 100 + '%';  
            flower.style.left = Math.random() * 100 + '%';  
            flower.style.animationDelay = (Math.random() * 10) + 's';  
            document.body.appendChild(flower);  
        }  
    }  

    createFlowers();  

    // Mendapatkan modal  
    var modal = document.getElementById("orderModal");  
    var productInput = document.getElementById("product");  
    
    // Mendapatkan tombol "Pesan Sekarang" dan menambah event listener    var orderNowBtn = document.getElementById("orderNowBtn");

    // Event listener untuk membuka modal saat klik "Pesan Sekarang"
    orderNowBtn.addEventListener('click', function() {
        modal.style.display = "block";
    });

    // Event listener untuk menutup modal saat klik tombol close
    var closeModalBtn = document.getElementsByClassName("close")[0];
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Event listener untuk klik di luar modal untuk menutupnya
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Fungsi untuk mengirim pesanan
    function submitOrder() {
        const productName = productInput.value;
        if (productName) {
            // Kirim data pesanan ke server
            fetch('/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product: productName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Pesanan berhasil dikirim!");
                    modal.style.display = "none"; // Tutup modal setelah sukses
                } else {
                    alert("Terjadi kesalahan saat mengirim pesanan.");
                }
            })
            .catch(error => {
                console.error("Error submitting order:", error);
                alert("Terjadi kesalahan saat mengirim pesanan.");
            });
        } else {
            alert("Silakan pilih produk.");
        }
    }

    // Event listener untuk mengirim pesanan ketika tombol "Kirim Pesanan" diklik
    var submitOrderBtn = document.getElementById("submitOrderBtn");
    submitOrderBtn.addEventListener('click', submitOrder);

});
    </script>
</body>
</html>  
    
    <!-- JavaScript -->  
    <script>
        // Initialize Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyC-3y-sFunqJ9BD50Ey1TxjVY43LPOUIUY",
            authDomain: "bouquetiverse.firebaseapp.com",
            databaseURL: "https://bouquetiverse-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "bouquetiverse",
            storageBucket: "bouquetiverse.appspot.com",
            messagingSenderId: "342340088573",
            appId: "1:342340088573:web:e1e055bfbe5de0be598c87"
        };
        
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        // Bagian baru: Cek koneksi ke Firebase
        const connectionStatusEl = document.getElementById('connectionStatus');
        const connectedRef = firebase.database().ref(".info/connected");
        
        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                console.log("Connected to Firebase");
                connectionStatusEl.textContent = "Terhubung ke server";
                connectionStatusEl.className = "connection-status connection-online";
                connectionStatusEl.style.display = "block";
                
                // Sembunyikan setelah 3 detik
                setTimeout(() => {
                    connectionStatusEl.style.display = "none";
                }, 3000);
            } else {
                console.log("Not connected to Firebase");
                connectionStatusEl.textContent = "Tidak terhubung ke server";
                connectionStatusEl.className = "connection-status connection-offline";
                connectionStatusEl.style.display = "block";
            }
        });

        // Enable offline persistence 
        firebase.database().goOffline();
        firebase.database().goOnline();
        
        document.addEventListener('DOMContentLoaded', function() {  
            // Tambahkan listener untuk status koneksi internet
            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
            
            // Cek status koneksi internet saat halaman dimuat
            updateOnlineStatus();
            
            function updateOnlineStatus() {
                const isOnline = navigator.onLine;
                console.log("Internet connection:", isOnline ? "Online" : "Offline");
                
                if (!isOnline) {
                    connectionStatusEl.textContent = "Tidak ada koneksi internet";
                    connectionStatusEl.className = "connection-status connection-offline";
                    connectionStatusEl.style.display = "block";
                    
                    // Disable buttons jika offline
                    document.querySelectorAll('.btn').forEach(btn => {
                        if (btn.id === "sendMessageBtn" || btn.id === "submitOrderBtn") {
                            btn.disabled = true;
                        }
                    });
                } else {
                    // Re-enable buttons jika online
                    document.querySelectorAll('.btn').forEach(btn => {
                        if (btn.id === "sendMessageBtn" || btn.id === "submitOrderBtn") {
                            btn.disabled = false;
                        }
                    });
                }
            }
            
            // Smooth scrolling  
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {  
                anchor.addEventListener('click', function(e) {  
                    if (this.getAttribute('href') === '#') return;
                    
                    e.preventDefault();  
                    
                    const targetId = this.getAttribute('href');  
                    const targetElement = document.querySelector(targetId);  
                    
                    if (targetElement) {  
                        window.scrollTo({  
                            top: targetElement.offsetTop - 100,  
                            behavior: 'smooth'  
                        });  
                    }  
                });  
            });  
            
            // Membuat elemen bunga tambahan  
            function createFlowers() {  
                for (let i = 0; i < 5; i++) {  
                    const flower = document.createElement('div');  
                    flower.className = 'floating-flower';  
                    flower.style.top = Math.random() * 100 + '%';  
                    flower.style.left = Math.random() * 100 + '%';  
                    flower.style.animationDelay = (Math.random() * 10) + 's';  
                    document.body.appendChild(flower);  
                }  
            }  

            createFlowers();  

            // Mendapatkan modal  
            var modal = document.getElementById("orderModal");  
            var productInput = document.getElementById("product");  
            
            // Mendapatkan tombol "Pesan Sekarang" dan menambah event listener  
            document.querySelectorAll('.btn[data-product]').forEach(button => {  
                button.addEventListener('click', function(e) {  
                    e.preventDefault();
                    
                    // Check if online
                    if (!navigator.onLine) {
                        showNotification('messageNotification', 'Tidak dapat memesan saat offline. Silakan cek koneksi internet Anda.', false);
                        return;
                    }   
                    
                    productInput.value = this.dataset.product; // Set nama produk ke input  
                    modal.style.display = "block";   
                });  
            });  

            // Mendapatkan elemen <span> yang menutup modal  
            var closeModal = document.getElementsByClassName("close")[0];  

            // Ketika pengguna mengklik <span> (x), tutup modal  
            closeModal.onclick = function() {  
                modal.style.display = "none";  
            }  

            // Ketika pengguna mengklik di luar modal, tutup modal  
            window.onclick = function(event) {  
                if (event.target == modal) {  
                    modal.style.display = "none";  
                }  
            }  

            // Show notification
            function showNotification(elementId, message, isSuccess) {
                const notification = document.getElementById(elementId);
                notification.textContent = message;
                notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
                notification.style.display = 'block';
                
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            }
            
            // Fungsi untuk mengirim data dengan timeout
            function sendDataWithTimeout(ref, data, onSuccess, onError, buttonId, loaderId) {
                // Check if online
                if (!navigator.onLine) {
                    onError(new Error('Tidak ada koneksi internet'));
                    return;
                }

                const btn = document.getElementById(buttonId);
                const loader = document.getElementById(loaderId);
                
                // Disable button and show loading
                btn.disabled = true;
                loader.style.display = 'inline-block';
                
                // Create a timeout promise
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout! Server tidak merespon dalam 10 detik')), 10000);
                });
                
                // Race between Firebase operation and timeout
                Promise.race([
                    ref.push(data),
                    timeoutPromise
                ])
                .then(() => {
                    loader.style.display = 'none';
                    btn.disabled = false;
                    onSuccess();
                })
                .catch(error => {
                    console.error("Firebase error:", error);
                    loader.style.display = 'none';
                    btn.disabled = false;
                    onError(error);
                });
            }

            // Menyimpan pesanan ke Firebase  
            var orderForm = document.querySelector('.order-form');
            
            orderForm.addEventListener('submit', function(e) {  
                e.preventDefault(); // Mencegah refresh
                
                const newOrder = {  
                    product: productInput.value,  
                    name: orderForm.orderName.value,  
                    email: orderForm.orderEmail.value,  
                    phone: orderForm.orderPhone.value,  
                    address: orderForm.orderAddress.value,  
                    date: new Date().toLocaleString(),
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };

                // Using the new function with timeout
                const ordersRef = database.ref('orders');
                sendDataWithTimeout(
                    ordersRef, 
                    newOrder,
                    () => { // Success handler
                        showNotification('orderNotification', 'Pesanan berhasil dikirim!', true);
                        orderForm.reset();
                        setTimeout(() => {
                            modal.style.display = "none";
                        }, 2000);
                    },
                    (error) => { // Error handler
                        showNotification('orderNotification', 'Error: ' + error.message, false);
                    },
                    'submitOrderBtn',
                    'orderLoader'
                );
            });  

            // Menyimpan pesan ke Firebase dengan timeout 
            var contactForm = document.querySelector('.contact-form');
            
            contactForm.addEventListener('submit', function(e) {  
                e.preventDefault(); // Mencegah refresh
                
                const newMessage = {  
                    name: contactForm.querySelector('#name').value,  
                    email: contactForm.querySelector('#email').value,  
                    phone: contactForm.querySelector('#phone').value,  
                    message: contactForm.querySelector('#message').value,  
                    date: new Date().toLocaleString(),
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                };

                // Using the new function with timeout
                const messagesRef = database.ref('messages');
                sendDataWithTimeout(
                    messagesRef, 
                    newMessage,
                    () => { // Success handler
                        showNotification('messageNotification', 'Pesan berhasil dikirim!', true);
                        contactForm.reset();
                    },
                    (error) => { // Error handler
                        showNotification('messageNotification', 'Error: ' + error.message, false);
                    },
                    'sendMessageBtn',
                    'sendMessageBtn' // We'll create a loader inside the button
                );
            });

            // Add loader to message send button
            const sendMessageBtn = document.getElementById('sendMessageBtn');
            if (!sendMessageBtn.querySelector('.loader')) {
                const loader = document.createElement('span');
                loader.className = 'loader';
                loader.style.display = 'none';
                sendMessageBtn.appendChild(loader);
            }

            // Admin Panel Functionality
            // Set default admin credentials if not set
            if (!localStorage.getItem('adminCredentials')) {
                localStorage.setItem('adminCredentials', JSON.stringify({
                    username: 'admin',
                    password: 'admin123'
                }));
            }

            const adminIconBtn = document.getElementById('adminIconBtn');
            const adminPanel = document.getElementById('adminPanel');
            const adminCloseBtn = document.getElementById('adminCloseBtn');
            const loginForm = document.getElementById('loginForm');
            const adminContent = document.getElementById('adminContent');
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');

            // Open admin panel when clicking admin icon
            adminIconBtn.addEventListener('click', function(e) {
                e.preventDefault();
                adminPanel.style.display = 'block';
                
                // Check if logged in
                if (localStorage.getItem('adminLoggedIn') === 'true') {
                    loginForm.style.display = 'none';
                    adminContent.style.display = 'block';
                    loadAdminData(); // Load data when opening panel
                } else {
                    loginForm.style.display = 'block';
                    adminContent.style.display = 'none';
                }
            });

            // Close admin panel
            adminCloseBtn.addEventListener('click', function() {
                adminPanel.style.display = 'none';
            });

            // Login functionality
            loginBtn.addEventListener('click', function() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const credentials = JSON.parse(localStorage.getItem('adminCredentials'));

                if (username === credentials.username && password === credentials.password) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    loginForm.style.display = 'none';
                    adminContent.style.display = 'block';
                    loadAdminData();
                } else {
                    alert('Username atau password salah!');
                }
            });

            // Logout functionality
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('adminLoggedIn');
                loginForm.style.display = 'block';
                adminContent.style.display = 'none';
            });

            // Tab functionality
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Remove active class from all tabs and contents
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    this.classList.add('active');
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // Load admin data with timeout
            function loadAdminData() {
                if (!navigator.onLine) {
                    document.getElementById('ordersList').innerHTML = '<div class="no-data">Tidak dapat memuat data - tidak ada koneksi internet</div>';
                    document.getElementById('messagesList').innerHTML = '<div class="no-data">Tidak dapat memuat data - tidak ada koneksi internet</div>';
                    return;
                }
                
                loadOrders();
                loadMessages();
            }

            // Load orders for admin panel with timeout
            function loadOrders() {
                const ordersList = document.getElementById('ordersList');
                ordersList.innerHTML = '<div style="text-align: center;"><p>Memuat data pesanan...</p><div class="loader" style="display: inline-block;"></div></div>';
                
                const ordersRef = database.ref('orders');
                
                // Create a timeout promise
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout! Server tidak merespon dalam 10 detik')), 10000);
                });
                
                // Race between Firebase operation and timeout
                Promise.race([
                    ordersRef.orderByChild('timestamp').once('value'),
                    timeoutPromise
                ])
                .then((snapshot) => {
                    ordersList.innerHTML = '';
                    
                    if (!snapshot.exists()) {
                        ordersList.innerHTML = '<div class="no-data">Belum ada pesanan</div>';
                        return;
                    }
                    
                    // Convert to array and reverse (newest first)
                    const orders = [];
                    snapshot.forEach((childSnapshot) => {
                        orders.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    orders.reverse();
                    
                    orders.forEach(order => {
                        const orderItem = document.createElement('div');
                        orderItem.className = 'data-item';
                        orderItem.innerHTML = `
                            <p><strong>Produk:</strong> ${order.product}</p>
                            <p><strong>Nama:</strong> ${order.name}</p>
                            <p><strong>Email:</strong> ${order.email}</p>
                            <p><strong>No. Handphone:</strong> ${order.phone}</p>
                            <p><strong>Alamat:</strong> ${order.address}</p>
                            <p class="date">Diterima: ${order.date}</p>
                        `;
                        ordersList.appendChild(orderItem);
                    });
                })
                .catch(error => {
                    console.error("Error loading orders:", error);
                    ordersList.innerHTML = `<div class="no-data">Error: ${error.message}</div>`;
                });
            }

            // Load messages for admin panel with timeout
            function loadMessages() {
                const messagesList = document.getElementById('messagesList');
                messagesList.innerHTML = '<div style="text-align: center;"><p>Memuat data pesan...</p><div class="loader" style="display: inline-block;"></div></div>';
                
                const messagesRef = database.ref('messages');
                
                // Create a timeout promise
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout! Server tidak merespon dalam 10 detik')), 10000);
                });
                
                // Race between Firebase operation and timeout
                Promise.race([
                    messagesRef.orderByChild('timestamp').once('value'),
                    timeoutPromise
                ])
                .then((snapshot) => {
                    messagesList.innerHTML = '';
                    
                    if (!snapshot.exists()) {
                        messagesList.innerHTML = '<div class="no-data">Belum ada pesan</div>';
                        return;
                    }
                    
                    // Convert to array and reverse (newest first)
                    const messages = [];
                    snapshot.forEach((childSnapshot) => {
                        messages.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    messages.reverse();
                    
                    messages.forEach(message => {
                        const messageItem = document.createElement('div');
                        messageItem.className = 'data-item';
                        messageItem.innerHTML = `
                            <p><strong>Nama:</strong> ${message.name}</p>
                            <p><strong>Email:</strong> ${message.email}</p>
                            <p><strong>No. Handphone:</strong> ${message.phone || 'Tidak diisi'}</p>
                            <p><strong>Pesan:</strong> ${message.message}</p>
                            <p class="date">Diterima: ${message.date}</p>
                        `;
                        messagesList.appendChild(messageItem);
                    });
                })
                .catch(error => {
                    console.error("Error loading messages:", error);
                    messagesList.innerHTML = `<div class="no-data">Error: ${error.message}</div>`;
                });
            }
            
            // Log errors to help debugging
            window.addEventListener('error', function(e) {
                console.error('Global error caught:', e.error);
            });
        });  