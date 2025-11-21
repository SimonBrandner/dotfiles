return {
	cmd = { "clangd" },
	filetypes = { "c", "cpp", "cc" },
	capabilities = {
		offsetEncoding = { "utf-8", "utf-16" },
		textDocument = {
			completion = {
				editsNearCursor = true,
			},
		},
	},
	root_markers = { ".clangd", ".git" },
}
