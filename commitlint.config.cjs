/**
 * Commitlint configuration for conventional commits.
 *
 * @see https://commitlint.js.org/
 * @see https://www.conventionalcommits.org/
 * @type {import('@commitlint/types').UserConfig}
 */

// List of disallowed author/co-author emails or names
// You can use email addresses, names, or both
// Examples:
//   - '[email protected]' (blocks by email)
//   - 'John Doe' (blocks by name)
//   - 'bot@example.com' (blocks bot accounts)
const DISALLOWED_AUTHORS = [
  // Add disallowed authors/emails here
  // Example: '[email protected]',
  // Example: 'Disallowed Name',
];

/**
 * Custom rule to block commits from disallowed authors or co-authors
 * @param {import('@commitlint/types').Parsed} parsed - Parsed commit object
 * @param {string} when - Rule condition ('always' or 'never')
 * @param {string[]} disallowed - Array of disallowed author identifiers
 * @returns {[boolean, string?]} - [isValid, errorMessage]
 */
function checkDisallowedAuthors(parsed, when, disallowed) {
  if (!disallowed || disallowed.length === 0) {
    return [true];
  }

  const errors = [];
  const raw = parsed.raw || '';

  // Check for disallowed co-authors in footer
  // Co-authored-by format: "Co-authored-by: Name <email>"
  const coAuthorRegex = /^Co-authored-by:\s*(.+?)\s*<([^>]+)>/gim;
  let match;
  while ((match = coAuthorRegex.exec(raw)) !== null) {
    const name = match[1].trim();
    const email = match[2].trim();

    // Check if email or name matches any disallowed author
    if (
      disallowed.some(
        (disallowedAuthor) =>
          email.toLowerCase() === disallowedAuthor.toLowerCase() ||
          name.toLowerCase() === disallowedAuthor.toLowerCase()
      )
    ) {
      errors.push(
        `Co-author "${name} <${email}>" is not allowed to commit to this repository.`
      );
    }
  }

  // Check git author from environment variables
  // Note: To check the git author, you need to set these environment variables
  // in your git hook. If using husky, modify .husky/commit-msg to export:
  //   export GIT_AUTHOR_EMAIL=$(git log -1 --format='%ae' HEAD)
  //   export GIT_AUTHOR_NAME=$(git log -1 --format='%an' HEAD)
  // Or for the current commit being created:
  //   export GIT_AUTHOR_EMAIL=$(git var GIT_AUTHOR_IDENT | sed -n 's/^.*<\(.*\)>.*$/\1/p')
  //   export GIT_AUTHOR_NAME=$(git var GIT_AUTHOR_IDENT | sed -n 's/^\(.*\) <.*$/\1/p')
  const gitAuthorEmail = process.env.GIT_AUTHOR_EMAIL;
  const gitAuthorName = process.env.GIT_AUTHOR_NAME;

  if (gitAuthorEmail || gitAuthorName) {
    if (
      disallowed.some(
        (disallowedAuthor) =>
          (gitAuthorEmail &&
            gitAuthorEmail.toLowerCase() === disallowedAuthor.toLowerCase()) ||
          (gitAuthorName &&
            gitAuthorName.toLowerCase() === disallowedAuthor.toLowerCase())
      )
    ) {
      errors.push(
        `Author "${gitAuthorName || ''} <${gitAuthorEmail || ''}>" is not allowed to commit to this repository.`
      );
    }
  }

  if (errors.length > 0) {
    return [false, errors.join(' ')];
  }

  return [true];
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
    'header-max-length': [2, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    // Custom rule to block disallowed authors/co-authors
    // Set severity to 2 (error) and provide the list of disallowed authors
    'no-disallowed-authors': [
      2,
      'always',
      DISALLOWED_AUTHORS,
      checkDisallowedAuthors,
    ],
  },
}
