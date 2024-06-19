return {
	"sbdchd/neoformat",
	config = function()
		-- Format on save
		vim.api.nvim_create_autocmd("BufWritePre", {
			command = "Neoformat",
		})
	end,
}
