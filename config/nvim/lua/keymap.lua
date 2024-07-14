-- Global
vim.g.mapleader = " "
vim.keymap.set("n", "<C-q>", ":qa<CR>")

-- Search
vim.keymap.set("n", "<C-k>", '<cmd> lua require("telescope.builtin").find_files()<CR>')
vim.keymap.set("n", "<C-p>", ":Navbuddy<CR>")
vim.keymap.set("n", "<leader>sb", ":Telescope buffers<CR>")
vim.keymap.set("n", "<leader>ss", ":Telescope resession<CR>")
vim.keymap.set("n", "<leader>sa", '<cmd>lua require("telescope.builtin").live_grep()<CR>')
vim.keymap.set("n", "<leader>sf", "/")
vim.keymap.set("n", "<leader>sc", ":noh<CR>")

-- Buffers
vim.keymap.set("n", "<C-Tab>", ":bn<CR>")
vim.keymap.set("n", "<C-S-Tab>", ":bp<CR>")
vim.keymap.set("n", "<C-w>", ":bp<CR> :bd#<CR>")
vim.keymap.set("n", "<C-s>", ":w<CR>")

-- Windows
vim.keymap.set("n", "<leader>wq", ":q<CR>")
vim.keymap.set("n", "<leader>wsh", ":wincmd s<CR>")
vim.keymap.set("n", "<leader>wsv", ":wincmd v<CR>")
vim.keymap.set("n", "<leader>wp", ":wincmd p<CR>")
vim.keymap.set("n", "<leader>wh", ":wincmd h<CR>")
vim.keymap.set("n", "<leader>wj", ":wincmd j<CR>")
vim.keymap.set("n", "<leader>wk", ":wincmd k<CR>")
vim.keymap.set("n", "<leader>wl", ":wincmd l<CR>")
vim.keymap.set("n", "<leader>wR", ":wincmd r<CR>")
vim.keymap.set("n", "<leader>wr", ':lua require("resize-mode").start()<CR>')
vim.keymap.set("n", "<leader>wf", ":Neotree toggle<CR>")

-- Terminal
vim.keymap.set("n", "<leader>t", ":ToggleTerm<CR>")
vim.api.nvim_create_autocmd("TermEnter", {
	callback = function()
		-- If the terminal window is lazygit, we do not make changes to avoid clashes
		if string.find(vim.api.nvim_buf_get_name(0), "lazygit") then
			return
		end

		vim.keymap.set("t", "<ESC>", function()
			vim.cmd("stopinsert")
		end, { buffer = true })
	end,
})

-- LSP
vim.keymap.set("n", "<leader>lh", "<cmd>lua vim.lsp.buf.hover()<CR>")
vim.keymap.set("n", "<leader>lr", "<cmd>lua vim.lsp.buf.rename()<CR>")
vim.keymap.set("n", "<leader>la", "<cmd>lua vim.lsp.buf.code_action()<CR>")
vim.keymap.set("n", "<leader>ld", '<cmd>lua require("telescope.builtin").lsp_definitions()<CR>')
vim.keymap.set("n", "<leader>lu", '<cmd>lua require("telescope.builtin").lsp_references()<CR>')
vim.keymap.set("n", "<leader>lp", ":Trouble diagnostics toggle<CR>")

-- Delete not cut
vim.keymap.set("v", "p", '"_dP')
vim.keymap.set({ "n", "v" }, "D", '"_d')
vim.keymap.set({ "n", "v" }, "X", '"_x')

-- Retab
vim.keymap.set("n", "<leader>Tt", ":%retab!<CR>")

-- RipSub
vim.keymap.set({ "n", "v" }, "<leader>Ts", '<cmd>lua require("rip-substitute").sub()<CR>')

-- MultiCurstor
vim.keymap.set("n", "<C-c>", ":MCunderCursor<CR>")

-- Move line
vim.keymap.set("v", "<A-j>", ":m '>+1<CR>gv=gv")
vim.keymap.set("v", "<A-k>", ":m '<-2<CR>gv=gv")
vim.keymap.set("n", "<A-j>", ":m .+1<CR>==")
vim.keymap.set("n", "<A-k>", ":m .-2<CR>==")

-- GIT
vim.keymap.set("n", "<leader>g", "<cmd>LazyGit<CR>")

-- Czech layout
vim.cmd(":map ; `")
vim.cmd(":map + !")
vim.cmd(":map ě @")
vim.cmd(":map š #")
vim.cmd(":map č $")
vim.cmd(":map ř %")
vim.cmd(":map ž ^")
vim.cmd(":map ý &")
vim.cmd(":map á *")
vim.cmd(":map í {")
vim.cmd(":map é }")
