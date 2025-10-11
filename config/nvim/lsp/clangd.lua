return {
	cmd = { "clangd" },
	filetypes = { "c", "cpp" },
	capabilities = {
		offsetEncoding = { "utf-8", "utf-16" },
		textDocument = {
			completion = {
				editsNearCursor = true,
			},
		},
	},
}
