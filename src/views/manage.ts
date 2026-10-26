export function getManageHtml(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UMC Campus SSO Directory Simulator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen">
  <!-- Top Navigation -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
          🎓
        </div>
        <div>
          <h1 class="font-bold text-slate-900 text-base leading-tight">UMC SSO Directory Simulator</h1>
          <p class="text-xs text-slate-500">Resource Provider untuk Integrasi Perpustakaan UMC</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="/docs" target="_blank" class="text-xs font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition">
          Swagger Docs &rarr;
        </a>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Simulator Active
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Notice Banner -->
    <div class="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-sm font-semibold text-indigo-950">Simulasi SSO Multi-Role</h2>
        <p class="text-xs text-indigo-700 max-w-2xl leading-relaxed">
          Tambahkan email akun Google Anda di sini dengan role yang diinginkan (Mahasiswa, Dosen, atau Staff). Saat login ke aplikasi perpustakaan dengan Google tersebut, sistem otomatis mencocokkan identitas dan rolenya dari simulator ini.
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs font-medium text-indigo-900 bg-white/80 px-3 py-2 rounded-xl border border-indigo-200 shrink-0">
        <span class="text-indigo-500 font-bold">API Target:</span> /api/oauth/login
      </div>
    </div>

    <!-- 2 Column Layout: Form & Live Tester -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Form Input User -->
      <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900" id="formTitle">Tambah / Update Akun SSO</h3>
            <p class="text-xs text-slate-500">Mendukung upsert: jika email sudah ada, data langsung diperbarui</p>
          </div>
          <button type="button" onclick="resetForm()" class="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50">
            Reset Form
          </button>
        </div>

        <form id="userForm" onsubmit="handleSubmit(event)" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Google / Akun Login <span class="text-rose-500">*</span>
            </label>
            <input 
              type="email" 
              id="inputEmail" 
              required 
              placeholder="contoh: nama.anda@gmail.com atau user@campus.ac.id" 
              class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <!-- Name & Role -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                id="inputName" 
                placeholder="Rizqi Noor Fauzan" 
                class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Role SSO Kampus</label>
              <select 
                id="inputRole" 
                onchange="handleRoleChange()" 
                class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              >
                <option value="mahasiswa">Mahasiswa (Library: student)</option>
                <option value="dosen">Dosen / Dosen Pengajar (Library: lecturer)</option>
                <option value="staff">Staff Kampus (Library: staff)</option>
              </select>
            </div>
          </div>

          <!-- NIM & NIDN -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div id="nimContainer">
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">NIM (Nomor Induk Mahasiswa)</label>
              <input 
                type="text" 
                id="inputNim" 
                placeholder="2021001" 
                class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
            <div id="nidnContainer">
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">NIDN (Nomor Induk Dosen)</label>
              <input 
                type="text" 
                id="inputNidn" 
                placeholder="0412345678" 
                class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <!-- Fakultas & Prodi -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Fakultas</label>
              <input 
                type="text" 
                id="inputFaculty" 
                placeholder="Teknik / FKIP / FEB" 
                class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">Program Studi</label>
              <input 
                type="text" 
                id="inputProdi" 
                placeholder="Teknik Informatika" 
                class="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <!-- Status & Actions -->
          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-slate-700">Status Akun:</label>
              <select id="inputStatus" class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button 
              type="submit" 
              id="submitBtn"
              class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
            >
              <span>Simpan Akun SSO</span>
            </button>
          </div>
        </form>

        <div id="formAlert" class="hidden p-3 rounded-xl text-xs font-medium"></div>
      </div>

      <!-- Right: Live Response Simulator Preview -->
      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">Simulasi Respon SSO</h3>
              <p class="text-xs text-slate-500">Payload yang dikirim ke Library UMC saat login</p>
            </div>
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Live Mock
            </span>
          </div>

          <div class="space-y-3">
            <div class="flex gap-2">
              <input 
                type="email" 
                id="testEmailInput" 
                placeholder="Ketik email untuk tes respon..." 
                class="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <button 
                type="button" 
                onclick="testSimulation()" 
                class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 transition"
              >
                Cek JSON
              </button>
            </div>

            <div class="relative">
              <pre id="jsonPreview" class="bg-slate-900 text-emerald-400 text-xs p-4 rounded-xl overflow-x-auto max-h-[380px] leading-relaxed select-all font-mono">
// Klik "Cek JSON" atau pilih salah satu akun dari tabel
// untuk melihat struktur response yang akan dikonsumsi oleh backend library.
{
  "info": "Siap melakukan simulasi autentikasi SSO"
}
              </pre>
            </div>
          </div>
        </div>

        <div class="text-[11px] text-slate-400 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span>Mapping: mahasiswa &rarr; student, dosen &rarr; lecturer, staff &rarr; staff</span>
          <span class="font-mono">JSON 200 / 401</span>
        </div>
      </div>
    </div>

    <!-- Active SSO Users Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-base font-bold text-slate-900">Daftar Akun SSO Terdaftar</h3>
          <p class="text-xs text-slate-500">Seluruh user yang aktif di database simulasi kampus</p>
        </div>
        <div class="flex items-center gap-2">
          <input 
            type="text" 
            id="searchBox" 
            oninput="filterTable()" 
            placeholder="Cari email / nama..." 
            class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
          />
          <button 
            type="button" 
            onclick="loadUsers()" 
            class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition" 
            title="Refresh tabel"
          >
            🔄
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th class="py-3 px-4">Nama & Email</th>
              <th class="py-3 px-4">Role Kampus</th>
              <th class="py-3 px-4">NIM / NIDN</th>
              <th class="py-3 px-4">Fakultas & Prodi</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody id="userTableBody" class="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td colspan="6" class="py-8 text-center text-slate-400">Memuat data user...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <script>
    let allUsers = [];

    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        allUsers = json.data || [];
        renderTable(allUsers);
      } catch (err) {
        console.error('Gagal memuat user:', err);
      }
    }

    function renderTable(users) {
      const tbody = document.getElementById('userTableBody');
      if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-400">Belum ada akun SSO yang tersimpan.</td></tr>';
        return;
      }

      tbody.innerHTML = users.map(u => {
        let roleBadge = 'bg-slate-100 text-slate-700 border-slate-200';
        if (u.role === 'mahasiswa') roleBadge = 'bg-blue-50 text-blue-700 border-blue-200';
        if (u.role === 'dosen') roleBadge = 'bg-purple-50 text-purple-700 border-purple-200';
        if (u.role === 'staff') roleBadge = 'bg-amber-50 text-amber-700 border-amber-200';

        const idNum = u.role === 'dosen' ? (u.nidn || '-') : (u.nim || '-');
        const idLabel = u.role === 'dosen' ? 'NIDN' : 'NIM';

        return \`
          <tr class="hover:bg-slate-50/60 transition group">
            <td class="py-3 px-4">
              <div class="font-semibold text-slate-900">\${escapeHtml(u.full_name || '(Tanpa Nama)')}</div>
              <div class="text-slate-500 font-mono text-[11px]">\${escapeHtml(u.email)}</div>
            </td>
            <td class="py-3 px-4">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium \${roleBadge}">
                \${escapeHtml(u.role)}
              </span>
            </td>
            <td class="py-3 px-4">
              <span class="text-slate-500 font-mono">\${idLabel}:</span> \${escapeHtml(idNum)}
            </td>
            <td class="py-3 px-4">
              <div class="text-slate-800 font-medium">\${escapeHtml(u.faculty || '-')}</div>
              <div class="text-slate-500 text-[11px]">\${escapeHtml(u.prodi || '-')}</div>
            </td>
            <td class="py-3 px-4">
              <span class="inline-flex items-center gap-1 font-medium \${u.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}">
                <span class="w-1.5 h-1.5 rounded-full \${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}"></span>
                \${escapeHtml(u.status || 'active')}
              </span>
            </td>
            <td class="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
              <button 
                onclick="testSimulation('\${u.email}')" 
                class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                title="Lihat Response SSO"
              >
                Cek JSON
              </button>
              <button 
                onclick='editUser(\${JSON.stringify(u).replace(/'/g, "&apos;")})' 
                class="px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition"
              >
                Edit
              </button>
              <button 
                onclick="deleteUser('\${u.email}')" 
                class="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition"
              >
                Hapus
              </button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function filterTable() {
      const q = document.getElementById('searchBox').value.toLowerCase().trim();
      const filtered = allUsers.filter(u => 
        (u.email || '').toLowerCase().includes(q) || 
        (u.full_name || '').toLowerCase().includes(q) ||
        (u.faculty || '').toLowerCase().includes(q) ||
        (u.prodi || '').toLowerCase().includes(q)
      );
      renderTable(filtered);
    }

    function handleRoleChange() {
      const role = document.getElementById('inputRole').value;
      const nimEl = document.getElementById('nimContainer');
      const nidnEl = document.getElementById('nidnContainer');
      if (role === 'dosen') {
        nimEl.classList.add('opacity-40');
        nidnEl.classList.remove('opacity-40');
      } else if (role === 'mahasiswa') {
        nimEl.classList.remove('opacity-40');
        nidnEl.classList.add('opacity-40');
      } else {
        nimEl.classList.add('opacity-40');
        nidnEl.classList.add('opacity-40');
      }
    }

    function editUser(user) {
      document.getElementById('inputEmail').value = user.email || '';
      document.getElementById('inputName').value = user.full_name || '';
      document.getElementById('inputRole').value = user.role || 'mahasiswa';
      document.getElementById('inputNim').value = user.nim || '';
      document.getElementById('inputNidn').value = user.nidn || '';
      document.getElementById('inputFaculty').value = user.faculty || '';
      document.getElementById('inputProdi').value = user.prodi || '';
      document.getElementById('inputStatus').value = user.status || 'active';
      document.getElementById('formTitle').innerText = 'Edit Akun: ' + user.email;
      handleRoleChange();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
      document.getElementById('userForm').reset();
      document.getElementById('formTitle').innerText = 'Tambah / Update Akun SSO';
      handleRoleChange();
    }

    async function handleSubmit(e) {
      e.preventDefault();
      const alertEl = document.getElementById('formAlert');
      alertEl.className = 'hidden';

      const payload = {
        email: document.getElementById('inputEmail').value.trim(),
        full_name: document.getElementById('inputName').value.trim(),
        role: document.getElementById('inputRole').value,
        nim: document.getElementById('inputNim').value.trim() || null,
        nidn: document.getElementById('inputNidn').value.trim() || null,
        faculty: document.getElementById('inputFaculty').value.trim() || null,
        prodi: document.getElementById('inputProdi').value.trim() || null,
        status: document.getElementById('inputStatus').value,
      };

      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Gagal menyimpan user');
        }

        alertEl.className = 'p-3 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 block';
        alertEl.innerText = json.message || 'User berhasil disimpan ke database SSO!';
        
        loadUsers();
        testSimulation(payload.email);
      } catch (err) {
        alertEl.className = 'p-3 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 block';
        alertEl.innerText = err.message || 'Terjadi kesalahan sistem';
      }
    }

    async function deleteUser(email) {
      if (!confirm('Yakin ingin menghapus akun ' + email + ' dari database SSO?')) return;
      try {
        const res = await fetch('/api/users/' + encodeURIComponent(email), {
          method: 'DELETE',
        });
        const json = await res.json();
        if (res.ok && json.success) {
          loadUsers();
        } else {
          alert(json.message || 'Gagal menghapus user');
        }
      } catch (err) {
        alert('Gagal menghubungi server');
      }
    }

    async function testSimulation(email) {
      const targetEmail = email || document.getElementById('testEmailInput').value.trim();
      if (!targetEmail) {
        alert('Masukkan email terlebih dahulu');
        return;
      }
      document.getElementById('testEmailInput').value = targetEmail;

      const previewEl = document.getElementById('jsonPreview');
      previewEl.innerText = '// Mengambil response /api/oauth/login untuk ' + targetEmail + '...';

      try {
        const res = await fetch('/api/oauth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail })
        });
        const json = await res.json();
        previewEl.innerText = JSON.stringify(json, null, 2);
      } catch (err) {
        previewEl.innerText = JSON.stringify({ error: 'Gagal fetch response: ' + err.message }, null, 2);
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    handleRoleChange();
    loadUsers();
  </script>
</body>
</html>`;
}
