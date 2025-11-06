// 读取JSON数据并渲染表格
fetch('data/wars.json')
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById('war-table');
    data.participants.forEach(member => {
      const row = table.insertRow();
      row.innerHTML = `
        <td>${member.name}</td>
        <td>${member.attacks}</td>
        <td>${member.stars}</td>
        <td class="${member.remaining > 0 ? 'warning' : ''}">${member.remaining}</td>
      `;
    });
  });