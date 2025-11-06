# hokingking.github.io
<html lang="zh-CN">
<head>
    <meta charset="utf-8" />
    <title>Excel 导入 / 导出 示例</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
        body{font-family:Segoe UI,system-ui,Arial;max-width:900px;margin:24px auto;padding:0 12px;color:#222}
        table{border-collapse:collapse;width:100%;margin-top:12px}
        th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}
        .controls{display:flex;gap:8px;flex-wrap:wrap}
        button,input[type=file]{padding:8px 12px;border:1px solid #888;background:#f7f7f7;border-radius:4px;cursor:pointer}
    </style>
</head>
<body>
    <h2>Excel 导入 / 导出 示例</h2>

    <div class="controls">
        <label>
            选择 Excel 文件：
            <input id="fileInput" type="file" accept=".xlsx,.xls,.csv" />
        </label>

        <button id="exportBtn">导出为 Excel (.xlsx)</button>
        <button id="exportCsvBtn">导出为 CSV (.csv)</button>
        <button id="clearBtn">清空表格</button>
    </div>

    <p>提示：你可以上传一个 Excel 文件查看内容，或编辑下方表格再导出为 .xlsx / .csv。</p>

    <table id="dataTable">
        <thead>
            <tr>
                <th>姓名</th>
                <th>年龄</th>
                <th>电子邮件</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>张三</td>
                <td>28</td>
                <td>zhangsan@example.com</td>
            </tr>
            <tr>
                <td>李四</td>
                <td>34</td>
                <td>lisi@example.com</td>
            </tr>
        </tbody>
    </table>

    <!-- SheetJS (xlsx) CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script>
        // 载入 Excel 文件并显示到表格
        const fileInput = document.getElementById('fileInput');
        const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

        fileInput.addEventListener('change', async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            const arrayBuffer = await f.arrayBuffer();
            const wb = XLSX.read(arrayBuffer, { type: 'array' });
            const firstSheetName = wb.SheetNames[0];
            const ws = wb.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(ws, { header: 1 }); // array of arrays

            // 清空 tbody
            dataTable.innerHTML = '';

            // 如果首行是表头，使用它；否则保留默认表头（简单处理）
            const tbody = dataTable;
            for (let r = 0; r < json.length; r++) {
                const row = json[r];
                // 跳过空行
                if (row.length === 0) continue;
                const tr = document.createElement('tr');
                for (let c = 0; c < row.length; c++) {
                    const td = document.createElement('td');
                    td.textContent = row[c] ?? '';
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
        });

        // 导出为 .xlsx（从 DOM table）
        document.getElementById('exportBtn').addEventListener('click', () => {
            const table = document.getElementById('dataTable');
            const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
            XLSX.writeFile(wb, "exported_table.xlsx");
        });

        // 导出为 CSV（从 DOM table）
        document.getElementById('exportCsvBtn').addEventListener('click', () => {
            const table = document.getElementById('dataTable');
            const ws = XLSX.utils.table_to_sheet(table);
            const csv = XLSX.utils.sheet_to_csv(ws);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exported_table.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });

        // 清空表格（保留表头）
        document.getElementById('clearBtn').addEventListener('click', () => {
            dataTable.innerHTML = '';
        });

        // 可编辑：双击单元格编辑并按回车保存
        document.getElementById('dataTable').addEventListener('dblclick', (ev) => {
            const td = ev.target.closest('td');
            if (!td) return;
            const orig = td.textContent;
            const input = document.createElement('input');
            input.value = orig;
            input.style.width = '100%';
            td.textContent = '';
            td.appendChild(input);
            input.focus();

            function save() {
                td.textContent = input.value;
            }
            input.addEventListener('blur', save);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                } else if (e.key === 'Escape') {
                    td.textContent = orig;
                }
            });
        });
    </script>
</body>
</html>
