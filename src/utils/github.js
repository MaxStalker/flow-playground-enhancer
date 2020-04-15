export const GIT_API = "api.github.com/repos/";

export const getData = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.json();
};

export const postData = async (url, token, data) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.json();
};

export const patch = async (url, token, data) => {
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return response.json();
};

export const getBranchUrl = (branch) => {
  return `/refs/heads/${branch || "master"}`;
};

export const getResourceUrl = (resourceName, repo, params = {}) => {
  const { repoOwner, repoName } = repo;
  const baseUrl = `https://${GIT_API}${repoOwner}/${repoName}`;
  const { filename, sha, branchSha, ref = "master" } = params;

  switch (resourceName) {
    case "master":
      return `${baseUrl}/git${getBranchUrl()}`;

    case "branchHead":
      return `${baseUrl}/git${getBranchUrl(ref)}`;

    case "trees":
      return `${baseUrl}/git/trees`;

    case "commits":
      return `${baseUrl}/git/commits`;

    case "commitBySha":
      return `${baseUrl}/commits/${sha}`;

    case "commitsByFile":
      return branchSha
        ? `${baseUrl}/commits?sha=branchSha&path=${filename}`
        : `${baseUrl}/commits?path=${filename}`;

    case "contents":
      return `${baseUrl}/contents/${filename}?ref=${ref}`;

    case 'newBranch':
      return `${baseUrl}/git/refs`;

    default:
      return "";
  }
};

export const getBranchData = async (token, repo, branch = "master") => {
  const url = getResourceUrl("master", repo, { branch });
  return getData(url, token);
};

export const getBranchCommits = async (token, repo, params) => {
  const url = getResourceUrl("commitsByFile", repo, params);
  return getData(url, token);
};

export const getFileContents = async (token, repo, params) => {
  const url = getResourceUrl("contents", repo, params);
  return getData(url, token);
};

export const getCommitBySha = async (token, repo, params) => {
  const url = getResourceUrl("commitBySha", repo, params);
  return getData(url, token);
};

export const createCommitNode = async (token, repo, params) => {
  const { prevSha, path, content } = params;

  const data = {
    base_tree: prevSha,
    tree: [
      {
        path,
        content,
        mode: "100644",
      },
    ],
  };
  const url = getResourceUrl("trees", repo);
  return await postData(url, token, data);
};

export const createCommit = async (token, repo, params) => {
  const { prevSha, commitSha, message } = params;
  const url = getResourceUrl("commits", repo);
  const data = {
    parents: [prevSha],
    tree: commitSha,
    message,
  };
  return postData(url, token, data);
};

export const updateRef = async (token, repo, params) => {
  const { newCommitSha } = params;
  const url = getResourceUrl("branchHead", repo, params);
  const data = {
    sha: newCommitSha,
    force: true,
  };
  return patch(url, token, data);
};

/*
export const createBranch = async (token, repo, params) => {
  const { ref } = params;
  const url = getResourceUrl("newBranch", repo, params);
  return postData(url, token, { ref });
};
 */
