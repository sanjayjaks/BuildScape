import api from './api';

export interface Project {
  _id?: string;
  title: string;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate?: string;
}

export const projectService = {
  async getAllProjects() {
    const response = await api.get('/projects');
    return response.data;
  },

  async getProjectById(id: string) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(project: Omit<Project, '_id'>) {
    const response = await api.post('/projects', project);
    return response.data;
  },

  async updateProject(id: string, project: Partial<Project>) {
    const response = await api.put(`/projects/${id}`, project);
    return response.data;
  },

  async deleteProject(id: string) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};