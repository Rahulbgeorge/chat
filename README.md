# Why using esm over commonjs


- commonjs is the old way of doing things, esm has backward compatibility of library and can handle modules written in commonjs, whereas vice versa is not possible

Key Differences
| Feature	| CommonJS (CJS)	|ES Modules (ESM) |
| ---------| ----------------| --------------|
|Syntax	|require() / module.exports|	import / export|
|Execution|	Synchronous|	Asynchronous|
|File Extension	|.js (default)|	.mjs or .js (with "type": "module")|
|Tree Shaking	|❌ No	|✅ Yes|
|Top-Level await	|❌ No	|✅ Yes|