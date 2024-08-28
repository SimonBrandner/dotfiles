return {
	"jake-stewart/multicursor.nvim",
	config = function()
		local mc = require("multicursor-nvim")
		mc.setup()

		vim.cmd.hi("link", "MultiCursorCursor", "Cursor")
		vim.cmd.hi("link", "MultiCursorVisual", "Visual")

		vim.keymap.set("n", "<esc>", function()
			if mc.hasCursors() then
				mc.clearCursors()
			end
		end)

		vim.keymap.set("n", "K", function()
			mc.addCursor("k")
		end)
		vim.keymap.set("n", "J", function()
			mc.addCursor("j")
		end)

		vim.keymap.set("n", "<c-leftmouse>", mc.handleMouse)
	end,
}
