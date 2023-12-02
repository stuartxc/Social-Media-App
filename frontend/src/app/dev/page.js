"use client";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const DevPage = () => {
	const [tables, setTables] = useState([]);
	const [columns, setColumns] = useState([]);

	const [selectedTable, setSelectedTable] = useState("");
	const [selectedColumns, setSelectedColumns] = useState([]);
	const [tableData, setTableData] = useState([]);
	const alertError = (error) => {
		error.json().then((res) => {
			alert(`Error: ${res.message}`);
		});
	};
	useEffect(() => {
		fetch(`${BACKEND_URL}/tables`, {
			method: "GET",
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => setTables(data.map((elem) => elem.tablename)))
			.catch(alertError);
	}, []);

	const handleTableChange = (e) => {
		setSelectedTable(e.target.value);
		setSelectedColumns([]);
		const selected = e.target.value;
		fetch(`${BACKEND_URL}/tableColumns/${selected}`, {
			method: "GET",
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => setColumns(data.map((col) => col.column_name)))
			.catch(alertError);
	};

	const onColumnClick = (column) => {
		if (selectedColumns.includes(column)) {
			setSelectedColumns(selectedColumns.filter((col) => col !== column));
		} else {
			setSelectedColumns([...selectedColumns, column]);
		}
	};

	const handleSubmit = () => {
		const queryStr = selectedColumns.join(",");
		const callURL = `${BACKEND_URL}/table/${selectedTable}?columns=${queryStr}`;

		fetch(callURL, {
			method: "GET",
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => {
				setTableData(data);
			})
			.catch(alertError);
	};

	useEffect(() => {}, [selectedTable]);
	return (
		<div className="flex">
			<div className="w-1/3 p-4">
				<select
					className="mb-4 border rounded"
					value={selectedTable}
					onChange={handleTableChange}
				>
					<option value="">Select a table</option>
					{tables.map((table) => (
						<option key={table} value={table}>
							{table}
						</option>
					))}
				</select>

				<div>
					<span className="border rounded my-2 px-4 py-2">
						Selected columns: {selectedColumns.join(", ")}
					</span>
					<ul>
						{columns.map((column) => (
							<li className="my-2">
								<button
									className={`py-2 px-6 border rounded ${
										!selectedColumns.includes(column)
											? "bg-blue-100"
											: "bg-blue-300"
									} shadow-lg hover:bg-blue-300`}
									key={column}
									onClick={() => onColumnClick(column)}
								>
									{column}
								</button>
							</li>
						))}
					</ul>
				</div>

				<div className="flex justify-center ">
					{/* Center the button */}
					<button
						className="border bg-green-200 hover:bg-green-500 rounded px-4 py-2"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			</div>
			<div className="w-2/3 p-4">
				<div className="overflow-x-auto relative border p-2">
					<span className="font-bold">Table</span>
					<table className="w-full text-md text-left">
						<thead className="text-xs">
							<tr>
								{selectedColumns.map((column) => (
									<th key={column} scope="col" className="py-3 px-6">
										{column}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{tableData.map((row, index) => (
								<tr key={index} className="bg-white border-b ">
									{selectedColumns.map((column) => {
										return (
											<td key={column} className="py-4 px-6">
												{row[column]}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default DevPage;
