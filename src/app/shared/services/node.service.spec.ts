import { NodeService } from './node.service';

describe('NodeService', () => {
  let service: NodeService;

  beforeEach(() => {
    service = new NodeService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve getFiles with nodes having key, label and children', async () => {
    const files = await service.getFiles();
    expect(files.length).toBeGreaterThan(0);
    expect(files[0]).toHaveProperty('key');
    expect(files[0]).toHaveProperty('label');
    expect(files[0]).toHaveProperty('children');
  });

  it('should include a Documents root node', async () => {
    const files = await service.getFiles();
    const labels = files.map((n: any) => n.label);
    expect(labels).toContain('Documents');
  });

  it('should return nested children inside root nodes', async () => {
    const files = await service.getFiles();
    const docs = files.find((n: any) => n.label === 'Documents');
    expect(docs?.children?.length).toBeGreaterThan(0);
  });
});
