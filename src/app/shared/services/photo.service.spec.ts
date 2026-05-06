import { PhotoService } from './photo.service';

describe('PhotoService', () => {
  let service: PhotoService;

  beforeEach(() => {
    service = new PhotoService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should resolve getImages with required fields', async () => {
    const images = await service.getImages();
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveProperty('itemImageSrc');
    expect(images[0]).toHaveProperty('thumbnailImageSrc');
    expect(images[0]).toHaveProperty('alt');
    expect(images[0]).toHaveProperty('title');
  });

  it('should return at least 10 images', async () => {
    const images = await service.getImages();
    expect(images.length).toBeGreaterThanOrEqual(10);
  });

  it('should have non-empty image sources', async () => {
    const images = await service.getImages();
    images.forEach((img) => {
      expect(img.itemImageSrc).toBeTruthy();
      expect(img.thumbnailImageSrc).toBeTruthy();
    });
  });
});
