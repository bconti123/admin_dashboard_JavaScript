const { BadRequestError } = require("../expressError");

/**
 * Generate SQL query for partial update.
 * 
 * @param {Object} dataToUpdate - The data to be updated.
 * @param {Object} jsToSql - The mapping from JavaScript property names to SQL column names.
 * @returns {Object} - The SQL query.
 * @throws {BadRequestError} - If no data is provided to update.
 */

const sqlForPartialUpdate = (dataToUpdate, jsToSql) => {
    
    const keys = Object.keys(dataToUpdate);

    if (keys.length === 0) throw new BadRequestError();
    
    const cols = keys.map((colName, idx) => {
        const sqlColName = jsToSql[colName] || colName;
        const placeholder = `$${idx + 1}`;
        return `"${sqlColName}"=${placeholder}` 
    })

    return {
        setCols: cols.join(","),
        values: Object.values(dataToUpdate),
    };
};

module.exports = { sqlForPartialUpdate }