import * as core from '@actions/core';
import { generateNotes } from '@semantic-release/release-notes-generator';
import { getOctokit } from '@actions/github';

export async function generate(
  title: string,
  repository: string,
  fromRef: string,
  toRef: string,
  githubToken: string
): Promise<string> {
  const [owner, repo] = repository.split('/');
  try {
    const octokit = getOctokit(githubToken);

    const commits = (
      await octokit.repos.compareCommits({
        owner: owner,
        repo: repo,
        base: fromRef,
        head: toRef
      })
    ).data.commits
      .filter((commit) => !!commit.commit.message)
      .map((commit) => ({
        message: commit.commit.message,
        hash: commit.sha
      }));

    const releaseNotes = await generateNotes(
      {},
      {
        commits,
        logger: { log: core.info },
        options: {
          repositoryUrl: `https://github.com/` + repository
        },
        lastRelease: { gitTag: fromRef },
        nextRelease: { gitTag: toRef, version: title }
      }
    );

    core.info(`Release notes: ${releaseNotes}`);
    return releaseNotes;
  } catch (error) {
    return `Action failed with error ${error}`;
  }
}
