module.exports = {
  branches: ['main'],
  tagFormat: 'v${version}',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', { changelogFile: 'changelog.md' }],
    [
      '@semantic-release/git',
      {
        assets: ['changelog.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    ['@semantic-release/npm', { npmPublish: true }],
    '@semantic-release/github',
  ],
}
