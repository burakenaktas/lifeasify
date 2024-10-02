module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'burakenaktas',
          name: 'lifeasify',
        },
        prerelease: false,
        draft: true,
      },
    },
  ],
};
