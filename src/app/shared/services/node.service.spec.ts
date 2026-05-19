import { NodeService } from './node.service';
import { TreeNode } from 'primeng/api';

describe('NodeService', () => {
  let service: NodeService;

  beforeEach(() => {
    service = new NodeService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve getFiles with a non-empty array', async () => {
    const files = await service.getFiles();
    expect(files.length).toBeGreaterThan(0);
  });

  it('each root node should have key, label and children', async () => {
    const files = await service.getFiles();
    files.forEach((n: TreeNode) => {
      expect(n).toHaveProperty('key');
      expect(n).toHaveProperty('label');
      expect(n).toHaveProperty('children');
    });
  });

  it('should expose a Disque système root node', async () => {
    const files = await service.getFiles();
    const labels = files.map((n: TreeNode) => n.label);
    expect(labels).toContain('Disque système');
  });

  it('should contain Projets, Documents, Bureau, Téléchargements, Dev under Disque système', async () => {
    const files = await service.getFiles();
    const disk = files.find((n: TreeNode) => n.label === 'Disque système');
    const childLabels = (disk?.children ?? []).map((c: TreeNode) => c.label);
    expect(childLabels).toContain('Projets');
    expect(childLabels).toContain('Documents');
    expect(childLabels).toContain('Bureau');
    expect(childLabels).toContain('Téléchargements');
    expect(childLabels).toContain('Dev');
  });

  it('Projets should include marcOS and the absurd side-project folders', async () => {
    const files = await service.getFiles();
    const disk = files.find((n: TreeNode) => n.label === 'Disque système');
    const projets = disk?.children?.find((c: TreeNode) => c.label === 'Projets');
    const labels = (projets?.children ?? []).map((c: TreeNode) => c.label);
    expect(labels).toContain('marcOS');
    expect(labels).toContain('side-project');
    expect(labels).toContain('refacto_weekend.branch');
  });

  it('Documents should include the three CV variants', async () => {
    const files = await service.getFiles();
    const disk = files.find((n: TreeNode) => n.label === 'Disque système');
    const docs = disk?.children?.find((c: TreeNode) => c.label === 'Documents');
    const labels = (docs?.children ?? []).map((c: TreeNode) => c.label);
    expect(labels).toContain('CV_Marc_FINAL.pdf');
    expect(labels).toContain('CV_Marc_FINAL_v2.pdf');
    expect(labels).toContain('CV_Marc_VRAIMENT_FINAL.pdf');
  });

  it('Dev should include node_modules and .env', async () => {
    const files = await service.getFiles();
    const disk = files.find((n: TreeNode) => n.label === 'Disque système');
    const dev = disk?.children?.find((c: TreeNode) => c.label === 'Dev');
    const labels = (dev?.children ?? []).map((c: TreeNode) => c.label);
    expect(labels).toContain('node_modules');
    expect(labels).toContain('.env');
  });
});
