const DatabaseInstance = require("../database/Database");
const db = DatabaseInstance.getInstance();
class Dev {
	static async getTableColumns(req, res) {
		try {
			const { tableName } = req.params;
			const getTableColumns = `SELECT column_name FROM information_schema.columns WHERE table_name = $1;`;
			const columns = await db.queryDbValues(getTableColumns, [tableName]);
			res.status(200).send(columns);
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Error getting table columns" });
		}
	}

	static async getTableData(req, res) {
		try {
			const { tableName } = req.params;
			var { columns } = req.query;
			if (Array.isArray(columns) == false) {
				columns = [columns];
			}
			const columnStr = columns.join(", ");

			// const getTableColumns = `SELECT column_name FROM information_schema.columns WHERE table_name = $1;`;
			// const allColumns = await db.queryDbValues(getTableColumns, [tableName]);
			// const allowedColumns = allColumns.map((column) => column.column_name);
			// const isAllowed = columns.every((column) => allowedColumns.includes(column));
			// if (isAllowed) {
			const queryString = `SELECT ${columnStr} FROM ${tableName};`;
			const rows = await db.queryDb(queryString);
			res.status(200).json(rows);
			// } else {
			// 	res.status(400).json({ message: "No SQL injections please." });
			// }
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Error getting table data" });
		}
	}

	static createQueryArray(queryObject) {
		return Object.entries(queryObject).map(([key, value]) => `${key}`);
	}
	static async getTables(req, res) {
		try {
			const getTables = `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';`;
			const tables = await db.queryDb(getTables);
			res.status(200).json(tables);
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Error getting tables" });
		}
	}
}

module.exports = Dev;
