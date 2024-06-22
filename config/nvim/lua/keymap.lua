-- Global
vim.g.mapleader = " "
vim.keymap.set("n", "<C-q>", ":qa<CR>")

-- Search
vim.keymap.set("n", "<C-k>", '<cmd> lua require("telescope.builtin").find_files()<CR>')
vim.keymap.set("n", "<leader>sw", '<cmd> lua require("telescope.builtin").find_files()<CR>')
vim.keymap.set("n", "<leader>sb", ":Telescope buffers<CR>")
vim.keymap.set("n", "<leader>sg", '<cmd>lua require("telescope.builtin").live_grep()<CR>')
vim.keymap.set("n", "<leader>sf", "/")
vim.keymap.set("n", "<leader>sF", ":noh<CR>")

-- Buffers
vim.keymap.set("n", "<C-Tab>", ":bn<CR>")
vim.keymap.set("n", "<C-S-Tab>", ":bp<CR>")
vim.keymap.set("n", "<C-w>", ":bp<CR> :bd#<CR>")
vim.keymap.set("n", "<C-s>", ":w<CR>")

-- Windows
vim.keymap.set("n", "<leader>wq", ":q<CR>")
vim.keymap.set("n", "<leader>wsh", ":wincmd s<CR>")
vim.keymap.set("n", "<leader>wsv", ":wincmd v<CR>")
vim.keymap.set("n", "<leader>wh", ":wincmd h<CR>")
vim.keymap.set("n", "<leader>wj", ":wincmd j<CR>")
vim.keymap.set("n", "<leader>wk", ":wincmd k<CR>")
vim.keymap.set("n", "<leader>wl", ":wincmd l<CR>")
vim.keymap.set("n", "<leader>wR", ":wincmd r<CR>")
vim.keymap.set("n", "<leader>wr", ':lua require("resize-mode").start()<CR>')

-- Terminal
vim.cmd(":tnoremap <Esc> <C-\\><C-n>")
vim.keymap.set("n", "<leader>t", ":ToggleTerm<CR>")

-- LSP
vim.keymap.set("n", "<leader>ld", "<cmd>lua vim.lsp.buf.hover()<CR>")
vim.keymap.set("n", "<leader>lr", "<cmd>lua vim.lsp.buf.rename()<CR>")
vim.keymap.set("n", "<leader>la", "<cmd>lua vim.lsp.buf.code_action()<CR>")
vim.keymap.set("n", "<leader>ld", "<cmd>lua vim.lsp.buf.definition()<CR>")
vim.keymap.set("n", "<leader>lu", '<cmd>lua require("telescope.builtin").lsp_references()<CR>')
vim.keymap.set("n", "<leader>lD", ":Trouble diagnostics toggle<CR>")

-- Text manipulation
vim.keymap.set("n", "<leader>Tt", ":%retab!<CR>")
vim.keymap.set("n", "<C-c>", ":MCunderCursor<CR>")

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
