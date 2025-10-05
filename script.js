(function () {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const toast = document.getElementById('toast');
    const overlay = document.getElementById('overlay');
    const mobileMenu = document.getElementById('mobileMenu');

    const kpiRevenue = document.getElementById('kpiRevenue');
    const kpiRevenueDelta = document.getElementById('kpiRevenueDelta');
    const kpiUsers = document.getElementById('kpiUsers');
    const kpiUsersDelta = document.getElementById('kpiUsersDelta');
    const kpiOrders = document.getElementById('kpiOrders');
    const kpiOrdersDelta = document.getElementById('kpiOrdersDelta');
    const kpiConversion = document.getElementById('kpiConversion');
    const kpiConversionDelta = document.getElementById('kpiConversionDelta');

    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const ordersFilter = document.getElementById('ordersFilter');
    const globalSearch = document.getElementById('globalSearch');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const navLinks = document.querySelectorAll('.nav__item');
    const contactForm = document.getElementById('contactForm');
    const nextClassEl = document.getElementById('nextClass');
    const nextClassMetaEl = document.getElementById('nextClassMeta');
    const attendancePctEl = document.getElementById('attendancePct');
    const attendanceBarEl = document.getElementById('attendanceBar');
    const attendanceMetaEl = document.getElementById('attendanceMeta');
    const assignmentsListEl = document.getElementById('assignmentsList');
    const addAssignmentBtn = document.getElementById('addAssignment');
    const notesText = document.getElementById('notesText');
    const notesSave = document.getElementById('notesSave');
    const progressBarsEl = document.getElementById('progressBars');
    const progressViewEl = document.getElementById('progressView');
    const pomodoroTime = document.getElementById('pomodoroTime');
    const pomodoroStart = document.getElementById('pomodoroStart');
    const pomodoroPause = document.getElementById('pomodoroPause');
    const pomodoroReset = document.getElementById('pomodoroReset');
    const timetableTableBody = document.querySelector('#timetableTable tbody');
    const timetableWeek = document.getElementById('timetableWeek');
    const timetableExport = document.getElementById('timetableExport');
    const timetableDayFilter = document.getElementById('timetableDayFilter');

    // Profile
    const profileForm = document.getElementById('profileForm');
    const profileEdit = document.getElementById('profileEdit');
    const profileCancel = document.getElementById('profileCancel');

    // State
    const state = {
        theme: localStorage.getItem('theme') || 'light',
        orders: [],
        sort: { key: 'date', dir: 'desc' },
    };

    if (state.theme === 'dark') html.classList.add('dark');

    // Utils
    function formatCurrency(n) {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
    }
    function formatDate(d) {
        return new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit', year: 'numeric' }).format(d);
    }
    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            toast.classList.remove('opacity-100', 'translate-y-0');
        }, 2200);
    }

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        html.classList.toggle('dark', state.theme === 'dark');
        localStorage.setItem('theme', state.theme);
        showToast(`Theme: ${state.theme}`);
    });

    // Sidebar collapse (desktop) and open (mobile)
    sidebarToggle.addEventListener('click', () => {
        const collapsed = sidebar.getAttribute('data-collapsed') === 'true';
        sidebar.setAttribute('data-collapsed', String(!collapsed));
        showToast(!collapsed ? 'Sidebar expanded' : 'Sidebar collapsed');
    });

    function openSidebarMobile() {
        sidebar.setAttribute('data-open', 'true');
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('pointer-events-none', 'opacity-0');
    }
    function closeSidebarMobile() {
        sidebar.removeAttribute('data-open');
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('pointer-events-none', 'opacity-0');
    }
    mobileMenu.addEventListener('click', openSidebarMobile);
    overlay.addEventListener('click', closeSidebarMobile);

    // Sidebar nav smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-nav');
            if (target === 'contact') {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (target === 'timetable') {
                const el = document.getElementById('timetable');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            navLinks.forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
            closeSidebarMobile();
        });
    });

    // Mock data generation
    function randomBetween(min, max) { return Math.random() * (max - min) + min; }
    function randomInt(min, max) { return Math.floor(randomBetween(min, max)); }

    function generateKpis() {
        const revenue = 150000 + randomInt(-8000, 12000);
        const users = 4800 + randomInt(-300, 600);
        const orders = 1200 + randomInt(-150, 220);
        const conversion = +(2.3 + randomBetween(-0.3, 0.4)).toFixed(2);

        kpiRevenue.textContent = formatCurrency(revenue);
        kpiRevenueDelta.textContent = `${(randomBetween(-2, 4)).toFixed(1)}% vs last wk`;
        kpiRevenueDelta.style.color = revenue % 2 ? 'var(--ok)' : 'var(--warn)';

        kpiUsers.textContent = users.toLocaleString();
        kpiUsersDelta.textContent = `${(randomBetween(-3, 5)).toFixed(1)}%`;
        kpiUsersDelta.style.color = 'var(--ok)';

        kpiOrders.textContent = orders.toLocaleString();
        kpiOrdersDelta.textContent = `${(randomBetween(-1, 3)).toFixed(1)}%`;
        kpiOrdersDelta.style.color = 'var(--ok)';

        kpiConversion.textContent = `${conversion}%`;
        kpiConversionDelta.textContent = `${(randomBetween(-0.4, 0.6)).toFixed(2)}%`;
        kpiConversionDelta.style.color = conversion > 2.2 ? 'var(--ok)' : 'var(--warn)';
    }

    function generateOrders(count = 32) {
        const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
        const customers = ['Ava', 'Noah', 'Olivia', 'Liam', 'Emma', 'Ethan', 'Sophia', 'Mason', 'Mia', 'Lucas'];
        const orders = Array.from({ length: count }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - randomInt(0, 28));
            return {
                id: 10000 + i + randomInt(0, 999),
                customer: customers[randomInt(0, customers.length)],
                date,
                amount: +(randomBetween(20, 1500)).toFixed(2),
                status: statuses[randomInt(0, statuses.length)],
            };
        });
        state.orders = orders;
    }

    function renderOrders() {
        const q = (ordersFilter.value || globalSearch.value || '').toLowerCase();
        let rows = state.orders;
        if (q) {
            rows = rows.filter(r => String(r.id).includes(q) || r.customer.toLowerCase().includes(q) || r.status.toLowerCase().includes(q));
        }
        const { key, dir } = state.sort;
        rows = [...rows].sort((a, b) => {
            const va = a[key];
            const vb = b[key];
            if (va < vb) return dir === 'asc' ? -1 : 1;
            if (va > vb) return dir === 'asc' ? 1 : -1;
            return 0;
        });

        ordersTableBody.innerHTML = rows.map(r => `
            <tr>
                <td>#${r.id}</td>
                <td>${r.customer}</td>
                <td>${formatDate(r.date)}</td>
                <td>${formatCurrency(r.amount)}</td>
                <td>${r.status}</td>
            </tr>
        `).join('');
    }

    // Timetable
    const timetableState = {
        slots: [
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '14:00 - 15:00',
            '15:00 - 16:00',
        ],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        dataCurrent: {
            Monday:    [
                { subject: 'Math', teacher: 'Dr. Rao', room: 'A-101' },
                { subject: 'Physics', teacher: 'Dr. Lee', room: 'B-203' },
                null, { subject: 'HCI Lab', teacher: 'Ms. Patel', room: 'Lab-2' }, null,
                { subject: 'DSA', teacher: 'Mr. Kumar', room: 'C-310' }, null, null
            ],
            Tuesday:   [
                null, { subject: 'Operating Systems', teacher: 'Dr. Singh', room: 'C-201' }, null, null, null,
                { subject: 'DBMS', teacher: 'Dr. Chen', room: 'C-105' }, null, null
            ],
            Wednesday: [
                { subject: 'English', teacher: 'Ms. Brown', room: 'A-009' }, null, { subject: 'Algorithms', teacher: 'Dr. Kim', room: 'B-110' },
                null, null, null, { subject: 'IoT', teacher: 'Dr. Roy', room: 'E-401' }, null
            ],
            Thursday:  [
                null, null, { subject: 'Math', teacher: 'Dr. Rao', room: 'A-101' }, null, null, null, null, { subject: 'Sports', teacher: 'Coach', room: 'Gym' }
            ],
            Friday:    [
                null, { subject: 'DBMS Lab', teacher: 'Dr. Chen', room: 'Lab-1' }, { subject: 'DBMS Lab', teacher: 'Dr. Chen', room: 'Lab-1' },
                null, null, null, { subject: 'Seminar', teacher: 'Guest', room: 'Auditorium' }, null
            ],
        },
        dataNext: {
            Monday:    [{ subject: 'Math', teacher: 'Dr. Rao', room: 'A-101' }, null, null, { subject: 'HCI', teacher: 'Ms. Patel', room: 'C-210' }, null, null, null, null],
            Tuesday:   [null, { subject: 'OS', teacher: 'Dr. Singh', room: 'C-201' }, null, null, null, { subject: 'DBMS', teacher: 'Dr. Chen', room: 'C-105' }, null, null],
            Wednesday: [{ subject: 'English', teacher: 'Ms. Brown', room: 'A-009' }, null, { subject: 'Algorithms', teacher: 'Dr. Kim', room: 'B-110' }, null, null, null, null, null],
            Thursday:  [null, null, { subject: 'Math', teacher: 'Dr. Rao', room: 'A-101' }, null, null, null, null, { subject: 'Sports', teacher: 'Coach', room: 'Gym' }],
            Friday:    [null, null, null, null, null, null, { subject: 'Seminar', teacher: 'Guest', room: 'Auditorium' }, null],
        }
    };

    function renderTimetable() {
        if (!timetableTableBody) return;
        const useNext = timetableWeek && timetableWeek.value === 'next';
        const data = useNext ? timetableState.dataNext : timetableState.dataCurrent;
        const filterDay = (timetableDayFilter && timetableDayFilter.value !== 'all') ? timetableDayFilter.value : null;

        const rows = timetableState.slots.map((slot, i) => {
            const cells = timetableState.days
                .filter(day => !filterDay || day === filterDay)
                .map(day => {
                    const entry = data[day] && data[day][i];
                    if (!entry) return `<td class="p-3 text-slate-400">—</td>`;
                    const detail = `<div class=\"text-xs text-slate-500\">${entry.teacher} • ${entry.room}</div>`;
                    return `<td class="p-3"><div class=\"font-medium\">${entry.subject}</div>${detail}</td>`;
                }).join('');
            const timeCell = `<td class=\"p-3 font-medium\">${slot}</td>`;
            return `<tr class="border-b border-slate-200 dark:border-slate-800">${timeCell}${cells}</tr>`;
        }).join('');
        timetableTableBody.innerHTML = rows;
    }

    function exportTimetableCsv() {
        if (!timetableTableBody) return;
        const header = ['Time', ...timetableState.days].join(',');
        const useNext = timetableWeek && timetableWeek.value === 'next';
        const data = useNext ? timetableState.dataNext : timetableState.dataCurrent;
        const lines = timetableState.slots.map((slot, i) => {
            const cells = timetableState.days.map(day => (data[day] && data[day][i]) || '').join(',');
            return `${slot},${cells}`;
        });
        const csv = [header, ...lines].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timetable-${useNext ? 'next' : 'current'}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Timetable exported');
    }

    // Widgets logic
    function findNextClass(now = new Date()) {
        if (!timetableState || !timetableState.slots) return null;
        const dayIndex = now.getDay(); // 0 Sun .. 6 Sat
        const dayMap = {1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday'};
        const timeToMinutes = (s) => {
            const [hms, ] = s.split(' - ');
            const [h, m] = hms.split(':').map(Number);
            return h * 60 + m;
        };
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Build a list of upcoming slots for today and the next days
        const queue = [];
        for (let offset = 0; offset < 7; offset++) {
            const d = new Date(now);
            d.setDate(d.getDate() + offset);
            const wd = d.getDay();
            const name = dayMap[wd];
            if (!name) continue;
            const slots = timetableState.slots;
            for (let i = 0; i < slots.length; i++) {
                const entry = timetableState.dataCurrent[name] && timetableState.dataCurrent[name][i];
                if (!entry) continue;
                const startMins = timeToMinutes(slots[i]);
                const isToday = offset === 0;
                if (!isToday || startMins >= currentMinutes) {
                    queue.push({ day: name, dayOffset: offset, slot: slots[i], subject: entry.subject, teacher: entry.teacher, room: entry.room });
                }
            }
            if (queue.length) break;
        }
        return queue.length ? queue[0] : null;
    }

    function renderNextClass() {
        if (!nextClassEl || !nextClassMetaEl) return;
        const n = findNextClass();
        if (!n) {
            nextClassEl.textContent = 'No upcoming class';
            nextClassMetaEl.textContent = '—';
            return;
        }
        nextClassEl.textContent = n.subject;
        nextClassMetaEl.textContent = `${n.day} • ${n.slot} • ${n.teacher} • ${n.room}`;
    }

    // Next class countdown
    const nextClassCountdownEl = document.getElementById('nextClassCountdown');
    function renderNextClassCountdown() {
        if (!nextClassCountdownEl) return;
        const n = findNextClass();
        if (!n) { nextClassCountdownEl.textContent = '—'; return; }
        const [start] = n.slot.split(' - ');
        const [h, m] = start.split(':').map(Number);
        const target = new Date();
        target.setHours(h, m, 0, 0);
        if (n.dayOffset > 0) target.setDate(target.getDate() + n.dayOffset);
        const diff = Math.max(0, target.getTime() - Date.now());
        const mm = Math.floor(diff / 60000);
        const ss = Math.floor((diff % 60000) / 1000);
        nextClassCountdownEl.textContent = `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    }

    function renderAttendance() {
        if (!attendancePctEl || !attendanceBarEl || !attendanceMetaEl) return;
        const totalDays = 20; // mock
        const attended = 16; // mock
        const pct = Math.round((attended / totalDays) * 100);
        attendancePctEl.textContent = `${pct}%`;
        attendanceBarEl.style.width = `${pct}%`;
        attendanceBarEl.className = `h-2 rounded ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`;
        attendanceMetaEl.textContent = `${attended} of ${totalDays} days`;
        const subjectList = document.getElementById('attendanceSubjects');
        if (subjectList) {
            const subjects = [
                { name: 'Math', pct: 82 },
                { name: 'Physics', pct: 68 },
                { name: 'HCI', pct: 74 },
                { name: 'DBMS', pct: 55 },
                { name: 'OS', pct: 41 },
            ];
            subjectList.innerHTML = subjects.map(s => {
                const icon = s.pct > 75 ? '🟢' : s.pct >= 50 ? '🟠' : '🔴';
                return `<li class="flex justify-between"><span>${s.name}</span><span>${icon} ${s.pct}%</span></li>`;
            }).join('');
        }
    }

    const assignmentsState = {
        items: JSON.parse(localStorage.getItem('assignments') || '[]')
    };
    function persistAssignments() {
        localStorage.setItem('assignments', JSON.stringify(assignmentsState.items));
    }
    function renderAssignments() {
        if (!assignmentsListEl) return;
        if (!assignmentsState.items.length) {
            assignmentsListEl.innerHTML = '<li class="text-slate-500">No assignments</li>';
            return;
        }
        assignmentsListEl.innerHTML = assignmentsState.items.map((a, idx) => `
            <li class="flex items-center justify-between gap-2 rounded border border-slate-200 p-2 dark:border-slate-800">
                <div>
                    <div class="font-medium">${a.title}</div>
                    <div class="text-xs text-slate-500">Due: ${a.due || '—'}</div>
                </div>
                <div class="flex items-center gap-2">
                    <button data-idx="${idx}" class="markDone rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">${a.done ? 'Undo' : 'Done'}</button>
                    <button data-idx="${idx}" class="removeItem rounded bg-rose-600 px-2 py-1 text-xs text-white">Del</button>
                </div>
            </li>
        `).join('');
        assignmentsListEl.querySelectorAll('.markDone').forEach(btn => btn.addEventListener('click', () => {
            const i = +btn.getAttribute('data-idx');
            assignmentsState.items[i].done = !assignmentsState.items[i].done;
            persistAssignments();
            renderAssignments();
        }));
        assignmentsListEl.querySelectorAll('.removeItem').forEach(btn => btn.addEventListener('click', () => {
            const i = +btn.getAttribute('data-idx');
            assignmentsState.items.splice(i, 1);
            persistAssignments();
            renderAssignments();
        }));
    }
    if (addAssignmentBtn) {
        addAssignmentBtn.addEventListener('click', () => {
            const title = prompt('Assignment title');
            if (!title) return;
            const due = prompt('Due date (e.g. 2025-10-10)');
            assignmentsState.items.push({ title, due, done: false });
            persistAssignments();
            renderAssignments();
        });
    }

    // Notes
    if (notesText) {
        notesText.value = localStorage.getItem('notes') || '';
    }
    if (notesSave && notesText) {
        notesSave.addEventListener('click', () => {
            localStorage.setItem('notes', notesText.value || '');
            showToast('Notes saved');
        });
    }

    // Simple card drag (desktop only)
    const draggableCards = document.querySelectorAll('[draggable="true"]');
    let dragSrc = null;
    draggableCards.forEach(card => {
        card.addEventListener('dragstart', (e) => { dragSrc = card; e.dataTransfer.effectAllowed = 'move'; });
        card.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!dragSrc || dragSrc === card) return;
            const parent = card.parentElement;
            if (!parent) return;
            const srcNext = dragSrc.nextSibling === card ? dragSrc : dragSrc.nextSibling;
            card.parentElement.insertBefore(dragSrc, card);
            parent.insertBefore(card, srcNext);
        });
    });

    // Sorting handlers
    document.querySelectorAll('#ordersTable thead th').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.getAttribute('data-sort');
            if (!key) return;
            if (state.sort.key === key) {
                state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
            } else {
                state.sort.key = key;
                state.sort.dir = 'asc';
            }
            renderOrders();
        });
    });

    // Debounced filtering
    function debounce(fn, ms) { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), ms); }; }
    const renderOrdersDebounced = debounce(renderOrders, 150);
    ordersFilter.addEventListener('input', renderOrdersDebounced);
    globalSearch.addEventListener('input', renderOrdersDebounced);

    notificationsBtn.addEventListener('click', () => {
        const msgs = [
            'Upcoming class starts soon',
            'Assignment due tomorrow',
            'Exam schedule updated',
            'Event: Tech Talk at 5 PM',
        ];
        showToast(msgs[randomInt(0, msgs.length)]);
    });

    // Contact form submit handler
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = new FormData(contactForm);
            const name = String(form.get('name') || '').trim();
            const email = String(form.get('email') || '').trim();
            const subject = String(form.get('subject') || '').trim();
            const message = String(form.get('message') || '').trim();

            const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!name || !emailOk || !subject || !message) {
                showToast('Please fill all fields with a valid email');
                return;
            }
            // Simulate send
            showToast('Message sent! We will get back to you.');
            contactForm.reset();
        });
    }

    // Charts
    let trafficChart, channelChart;
    function buildCharts() {
        const trafficCtx = document.getElementById('trafficChart');
        const channelCtx = document.getElementById('channelChart');
        if (!trafficCtx || !channelCtx || !window.Chart) return;

        const labels = Array.from({ length: 30 }).map((_, i) => {
            const d = new Date(); d.setDate(d.getDate() - (29 - i));
            return `${d.getMonth() + 1}/${d.getDate()}`;
        });
        const trafficData = labels.map(() => 100 + randomInt(-30, 80));

        const brand = '#6366f1';
        trafficChart = new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Visitors',
                    data: trafficData,
                    borderColor: brand,
                    backgroundColor: 'transparent',
                    pointRadius: 0,
                    tension: 0.35,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(148,163,184,0.1)' } } }
            }
        });

        channelChart = new Chart(channelCtx, {
            type: 'doughnut',
            data: {
                labels: ['Web', 'Mobile', 'Retail', 'Partners'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#6366f1', '#22c55e', '#f59e0b', '#06b6d4']
                }]
            },
            options: {
                plugins: { legend: { position: 'bottom' } },
                cutout: '60%',
                maintainAspectRatio: false
            }
        });
    }

    // Progress tracking charts
    let monthlyChart, semesterChart;
    function buildProgressCharts() {
        if (!window.Chart) return;
        const monthlyCtx = document.getElementById('monthlyChart');
        const semesterCtx = document.getElementById('semesterChart');
        if (!monthlyCtx || !semesterCtx) return;

        const brand = '#6366f1';
        const muted = 'rgba(99,102,241,0.2)';
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'];
        const scores = months.map(() => 60 + randomInt(0, 40));
        monthlyChart = new Chart(monthlyCtx, {
            type: 'bar',
            data: { labels: months, datasets: [{ label: 'Avg Score', data: scores, backgroundColor: brand }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,0.1)' } }, x: { grid: { display: false } } } }
        });

        const subjects = ['Math','Physics','HCI','DBMS','OS'];
        const semScores = subjects.map(() => 50 + randomInt(0, 50));
        semesterChart = new Chart(semesterCtx, {
            type: 'radar',
            data: { labels: subjects, datasets: [{ label: 'Semester', data: semScores, backgroundColor: muted, borderColor: brand }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,0.1)' } } } }
        });
    }

    const progressState = {
        subject: [
            { name: 'Math', done: 7, total: 10 },
            { name: 'Physics', done: 5, total: 10 },
            { name: 'HCI', done: 8, total: 10 },
            { name: 'DBMS', done: 4, total: 10 },
            { name: 'OS', done: 6, total: 10 },
        ],
        week: [
            { name: 'Week 1', done: 6, total: 8 },
            { name: 'Week 2', done: 5, total: 8 },
            { name: 'Week 3', done: 7, total: 8 },
            { name: 'Week 4', done: 4, total: 8 },
        ]
    };

    function renderProgressBars() {
        if (!progressBarsEl) return;
        const mode = (progressViewEl && progressViewEl.value) || 'subject';
        const items = progressState[mode];
        progressBarsEl.innerHTML = items.map(it => {
            const pct = Math.round((it.done / it.total) * 100);
            const color = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';
            return `
                <div>
                    <div class="flex items-center justify-between text-sm">
                        <div class="font-medium">${it.name}</div>
                        <div class="text-slate-500">${it.done}/${it.total} (${pct}%)</div>
                    </div>
                    <div class="mt-1 h-2 w-full rounded bg-slate-200 dark:bg-slate-800">
                        <div class="h-2 rounded ${color}" style="width:${pct}%"></div>
                    </div>
                </div>`;
        }).join('');
    }

    // Pomodoro
    const pomodoroState = { seconds: 25 * 60, running: false, interval: null };
    function updatePomodoro() {
        if (!pomodoroTime) return;
        const m = Math.floor(pomodoroState.seconds / 60);
        const s = pomodoroState.seconds % 60;
        pomodoroTime.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
    function tickPomodoro() {
        if (!pomodoroState.running) return;
        pomodoroState.seconds = Math.max(0, pomodoroState.seconds - 1);
        updatePomodoro();
        if (pomodoroState.seconds === 0) {
            pomodoroState.running = false;
            clearInterval(pomodoroState.interval);
            showToast('Pomodoro finished! Take a short break.');
        }
    }
    if (pomodoroStart) pomodoroStart.addEventListener('click', () => {
        if (pomodoroState.running) return;
        pomodoroState.running = true;
        pomodoroState.interval = setInterval(tickPomodoro, 1000);
    });
    if (pomodoroPause) pomodoroPause.addEventListener('click', () => {
        pomodoroState.running = false;
        clearInterval(pomodoroState.interval);
    });
    if (pomodoroReset) pomodoroReset.addEventListener('click', () => {
        pomodoroState.running = false;
        clearInterval(pomodoroState.interval);
        pomodoroState.seconds = 25 * 60;
        updatePomodoro();
    });
    updatePomodoro();

    // Initial render
    generateKpis();
    generateOrders();
    renderOrders();
    buildCharts();
    buildProgressCharts();
    renderTimetable();
    if (timetableWeek) timetableWeek.addEventListener('change', renderTimetable);
    if (timetableDayFilter) timetableDayFilter.addEventListener('change', renderTimetable);
    if (timetableExport) timetableExport.addEventListener('click', exportTimetableCsv);
    renderNextClass();
    renderAttendance();
    renderAssignments();
    renderProgressBars();
    if (progressViewEl) progressViewEl.addEventListener('change', renderProgressBars);
    // Profile load/save
    function loadProfile() {
        const data = JSON.parse(localStorage.getItem('profile') || '{}');
        const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
        setVal('profName', data.name);
        setVal('profId', data.id);
        setVal('profBranch', data.branch);
        setVal('profCollege', data.college);
        setVal('profEmail', data.email);
        setVal('profAddress', data.address);
    }
    function saveProfile(e) {
        if (e) e.preventDefault();
        const val = id => (document.getElementById(id) || {}).value || '';
        const data = {
            name: val('profName'), id: val('profId'), branch: val('profBranch'), college: val('profCollege'), email: val('profEmail'), address: val('profAddress')
        };
        localStorage.setItem('profile', JSON.stringify(data));
        showToast('Profile saved');
    }
    loadProfile();
    if (profileForm) profileForm.addEventListener('submit', saveProfile);
    if (profileEdit && profileForm) profileEdit.addEventListener('click', () => profileForm.querySelector('input')?.focus());
    if (profileCancel && profileForm) profileCancel.addEventListener('click', loadProfile);

    // Update next class every minute
    setInterval(() => {
        renderNextClass();
        renderNextClassCountdown();
    }, 60000);
    // Also tick countdown every second
    setInterval(() => {
        renderNextClassCountdown();
    }, 1000);

    // Periodic updates
    setInterval(() => {
        generateKpis();
        // Notify if next class within 10 minutes
        const n = findNextClass();
        if (n) {
            const [start] = n.slot.split(' - ');
            const [h, m] = start.split(':').map(Number);
            const t = new Date(); t.setHours(h, m, 0, 0);
            if (n.dayOffset === 0) {
                const diffMin = Math.floor((t.getTime() - Date.now()) / 60000);
                if (diffMin === 10) showToast(`Upcoming: ${n.subject} at ${start}`);
            }
        }
        // randomly update an order
        if (state.orders.length) {
            const i = randomInt(0, state.orders.length);
            state.orders[i].amount = +(state.orders[i].amount + randomBetween(-10, 25)).toFixed(2);
        }
        renderOrders();
        // update charts
        if (trafficChart) {
            const last = trafficChart.data.datasets[0].data;
            last.shift();
            last.push(100 + randomInt(-30, 80));
            trafficChart.update('none');
        }
        if (channelChart) {
            const d = channelChart.data.datasets[0].data;
            for (let i = 0; i < d.length; i++) d[i] = Math.max(5, d[i] + randomInt(-3, 3));
            channelChart.update('none');
        }
        if (monthlyChart) {
            monthlyChart.data.datasets[0].data = monthlyChart.data.datasets[0].data.map(v => Math.max(40, Math.min(100, v + randomInt(-5, 5))));
            monthlyChart.update('none');
        }
        if (semesterChart) {
            semesterChart.data.datasets[0].data = semesterChart.data.datasets[0].data.map(v => Math.max(40, Math.min(100, v + randomInt(-5, 5))));
            semesterChart.update('none');
        }
    }, 5000);
})();

