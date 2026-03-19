# Git Commands Guide

A practical reference guide for useful Git commands and how to use them in real projects.

---

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Daily Workflow](#daily-workflow)
3. [Branching & Merging](#branching--merging)
4. [Viewing History](#viewing-history)
5. [Undoing Changes](#undoing-changes)
6. [Collaboration](#collaboration)
7. [Advanced Techniques](#advanced-techniques)
8. [Troubleshooting](#troubleshooting)

---

## Basic Setup

### Clone a Repository
```bash
git clone <repository-url>
```
**Use case:** Download a project from GitHub or another remote server to start working on it.

### Initialize a New Repository
```bash
git init
```
**Use case:** Turn an existing project folder into a Git repository to start version control.

### Configure User Information
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
**Use case:** Set your identity for all commits made on your machine. Use `--global` for all projects or omit it for the current project only.

### View Configuration
```bash
git config --list
```
**Use case:** Verify your Git configuration settings.

---

## Daily Workflow

### Check Repository Status
```bash
git status
```
**Use case:** See which files are modified, staged, or untracked before making a commit.

### Stage Changes for Commit
```bash
git add <filename>           # Stage specific file
git add .                    # Stage all changes
git add cypress/reports/     # Stage entire folder
```
**Use case:** Prepare changes to be committed. Staging allows you to organize commits logically.

### Commit Changes
```bash
git commit -m "Add cucumber report generation"
```
**Use case:** Save staged changes to the repository history with a clear message. **Best practice:** Use descriptive, present-tense commit messages.

### Commit and Stage in One Step
```bash
git commit -am "Update test configuration"
```
**Use case:** Automatically stage modified (but not new) files and commit them together.

### Push Changes to Remote
```bash
git push origin main              # Push to main branch
git push origin <branch-name>     # Push to specific branch
git push -u origin <branch-name>  # Push and set upstream tracking
```
**Use case:** Upload your commits to GitHub or another remote server so teammates can see your changes.

### Pull Latest Changes
```bash
git pull origin main
```
**Use case:** Download and merge the latest changes from the remote repository into your local branch. Always pull before pushing to avoid conflicts.

---

## Branching & Merging

### Create a New Branch
```bash
git branch <branch-name>
git checkout -b <branch-name>     # Create and switch to new branch
git switch -c <branch-name>       # Modern alternative to checkout
```
**Use case:** Create an isolated environment for developing a feature without affecting the main codebase.
**Example workflow:**
```bash
git checkout -b feature/add-html-reports
# Make changes
git add .
git commit -m "Add HTML report generation"
git push -u origin feature/add-html-reports
```

### List Branches
```bash
git branch              # Local branches
git branch -a           # All branches (local + remote)
git branch -r           # Remote branches only
```
**Use case:** See what branches exist in the project.

### Switch Between Branches
```bash
git checkout <branch-name>
git switch <branch-name>          # Modern alternative
```
**Use case:** Jump between different branches while working on multiple features.

### Delete a Branch
```bash
git branch -d <branch-name>       # Safe delete (prevents loss)
git branch -D <branch-name>       # Force delete
git push origin --delete <branch-name>  # Delete remote branch
```
**Use case:** Clean up branches after merging or when a feature is abandoned.

### Merge Branches
```bash
git checkout main
git merge <branch-name>
```
**Use case:** Integrate changes from a feature branch back into the main branch.
**Common scenario in Cypress projects:**
```bash
git checkout -b feature/fix-report-path
# Fix the reports folder issue
git add .
git commit -m "Fix: Ensure reports folder is created before tests run"
git checkout main
git merge feature/fix-report-path
git push origin main
```

---

## Viewing History

### View Commit History
```bash
git log                           # Full commit history
git log --oneline                 # Condensed view
git log --oneline -n 10           # Last 10 commits
git log --graph --oneline --all   # Visual branch history
```
**Use case:** Understand what changes were made and when. Helpful for code review and debugging.

### Show Specific Commit Details
```bash
git show <commit-hash>
git show HEAD~1                   # Show parent of current commit
```
**Use case:** View what changes were made in a specific commit, including the diff.

### View Changes in a File
```bash
git log --oneline <filename>           # See commits affecting this file
git diff HEAD~1 <filename>             # Compare file with previous version
git blame <filename>                   # See who changed each line
```
**Use case:** Track the history of a specific file, useful for debugging why something changed.

---

## Undoing Changes

### Discard Local Changes
```bash
git restore <filename>            # Discard changes in working directory
git checkout -- <filename>        # Alternative method
```
**Use case:** When you've made a mistake and want to revert a file to its last committed state.

### Unstage Changes
```bash
git restore --staged <filename>
git reset HEAD <filename>         # Alternative method
```
**Use case:** Remove a file from staging if you accidentally added it before committing.

### Amend Last Commit
```bash
git add .
git commit --amend --no-edit      # Amend without changing message
git commit --amend -m "New message"  # Amend with new message
```
**Use case:** Fix a mistake in your last commit without creating a new one. **Warning:** Only amend if not yet pushed!

### Revert a Commit
```bash
git revert <commit-hash>
```
**Use case:** Undo a specific commit while preserving history. Creates a new commit that reverses the changes. Safe for shared branches.

### Reset to Previous State
```bash
git reset --soft HEAD~1           # Undo last commit, keep changes staged
git reset --mixed HEAD~1          # Undo last commit, keep changes unstaged
git reset --hard HEAD~1           # Undo last commit, discard all changes
```
**Use case:** Go back to a previous commit state. **Warning:** `--hard` is destructive on shared branches!

---

## Collaboration

### Resolve Merge Conflicts
```bash
# 1. Pull and encounter conflicts
git pull origin main

# 2. Edit conflicted files to resolve manually
# Look for markers like:
# <<<<<<< HEAD
# your changes
# =======
# their changes
# >>>>>>> branch-name

# 3. Stage resolved files
git add <resolved-filenames>

# 4. Complete the merge
git commit -m "Resolve merge conflicts with main"
git push origin <branch>
```
**Use case:** When two people modify the same file, Git can't automatically merge. You must resolve conflicts manually.

### Fetch Without Merging
```bash
git fetch origin
```
**Use case:** Download remote changes without merging them yet. Useful to see what's on the remote before pulling.

### Combine Local Commits Before Pushing
```bash
git rebase -i HEAD~3              # Interactive rebase last 3 commits
# In editor: mark commits as 'reword', 'squash', or 'fixup'
```
**Use case:** Clean up your commit history before pushing to keep the main branch tidy. **Warning:** Only rebase before pushing!

---

## Advanced Techniques

### Cherry-Pick Specific Commits
```bash
git cherry-pick <commit-hash>
```
**Use case:** Apply a specific commit from one branch to another without merging the entire branch.
**Example:** You fixed a bug on a feature branch and want to apply just that fix to main:
```bash
git checkout main
git cherry-pick <commit-hash-of-bug-fix>
```

### Stash Work in Progress
```bash
git stash                         # Save uncommitted changes
git stash list                    # See stashed changes
git stash pop                     # Restore and remove latest stash
git stash apply stash@{0}         # Restore without removing
git stash drop                    # Delete stash
```
**Use case:** Temporarily save work when you need to switch branches without committing incomplete changes.

### Tag Important Releases
```bash
git tag v1.0.0                    # Create lightweight tag
git tag -a v1.0.0 -m "Release 1.0.0"  # Annotated tag with message
git push origin v1.0.0            # Push tag to remote
```
**Use case:** Mark specific points in history as releases for easy reference.

### Search for Commits
```bash
git log --grep="keyword"                    # Search commit messages
git log -S "code_pattern"                   # Search code changes
git log --author="Author Name"              # Filter by author
```
**Use case:** Find when a specific change or keyword was introduced.

---

## Troubleshooting

### View Remote URLs
```bash
git remote -v
```
**Use case:** Verify which remote repository you're connected to.

### Add/Change Remote
```bash
git remote add origin <url>
git remote set-url origin <new-url>
```
**Use case:** Connect to or update the remote repository address.

### Fix "Detached HEAD" State
```bash
git checkout -b recovery-branch    # Create new branch from detached state
git checkout main                  # Or switch to existing branch
```
**Use case:** You accidentally checked out a commit instead of a branch.

### See What You're About to Push
```bash
git diff origin/main main         # Compare your main with remote main
git log origin/main..main         # See commits not yet pushed
```
**Use case:** Review changes before pushing to avoid mistakes.

### Undo a Push to Remote (Use with Caution!)
```bash
git revert <commit-hash>          # Safest option - create new commit
git reset --hard <commit-hash>
git push -f origin main           # Force push (only if alone on branch!)
```
**Use case:** If you pushed a mistake. **Warning:** Force push can cause issues on shared branches!

---

## Best Practices Summary

✅ **DO:**
- Write clear, descriptive commit messages
- Pull before pushing to avoid conflicts
- Use branches for features and fixes
- Commit early and often with logical groupings
- Review your changes before committing

❌ **DON'T:**
- Force push to shared branches
- Commit large binary files
- Use vague messages like "fix" or "update"
- Commit credentials or sensitive data
- Skip testing before pushing

---

## Common Workflows in This Project

### Feature Development Workflow
```bash
git checkout -b feature/new-reporter
# Make changes to add new reporter support
git add cypress/reports/
git commit -m "Add JSON reporter configuration"
git push -u origin feature/new-reporter
# Open Pull Request on GitHub
# After review and approval:
git checkout main
git pull origin main
git merge feature/new-reporter
git push origin main
git branch -d feature/new-reporter
```

### Bug Fix Workflow
```bash
git checkout -b fix/reports-not-created
# Fix the issue (as we did earlier)
npm test  # Verify fix works
git add package.json cypress/plugins/index.js scripts/generate-cucumber-report.js
git commit -m "Fix: Create reports directory before tests run"
git push -u origin fix/reports-not-created
# Create Pull Request
# After merge:
git checkout main
git pull origin main
```

---

## Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

