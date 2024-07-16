return {
	"vyfor/cord.nvim",
	build = "./build",
	event = "VeryLazy",
	opts = {
		timer = {
			interval = 500,
		},
		display = {
			show_time = true,
			show_repository = true,
			show_cursor_position = true,
		},
		lsp = {
			show_problem_count = true,
		},
	},
}
