return {
	"smoka7/multicursors.nvim",
	event = "VeryLazy",
	dependencies = {
		'smoka7/hydra.nvim',
	},
	opts = {
		hint_config = false,
	},
	cmd = { 'MCstart', 'MCvisual', 'MCclear', 'MCpattern', 'MCvisualPattern', 'MCunderCursor' },
}
