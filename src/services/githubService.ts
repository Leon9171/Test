import axios from 'axios';

const API_BASE = 'https://api.github.com/repos';
const REPO_OWNER = 'Leon9171';
const REPO_NAME = 'Test';
const DATA_BRANCH = 'imkerei-erp-data';

class GitHubService {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
    };
  }

  async getFile(path: string): Promise<string> {
    try {
      const response = await axios.get(
        `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${DATA_BRANCH}`,
        { headers: this.getHeaders() }
      );
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } catch (error) {
      console.error('Error reading file:', error);
      return '';
    }
  }

  async saveFile(path: string, content: string, message: string): Promise<boolean> {
    try {
      let sha: string | undefined;
      try {
        const response = await axios.get(
          `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${DATA_BRANCH}`,
          { headers: this.getHeaders() }
        );
        sha = response.data.sha;
      } catch (e) {
        // File doesn't exist yet
      }

      const encodedContent = Buffer.from(content).toString('base64');

      const payload: any = {
        message,
        content: encodedContent,
        branch: DATA_BRANCH,
      };

      if (sha) {
        payload.sha = sha;
      }

      await axios.put(
        `${API_BASE}/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
        payload,
        { headers: this.getHeaders() }
      );

      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  }
}

export default new GitHubService();
