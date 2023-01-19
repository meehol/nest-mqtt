import { OutboundResponseSerializer } from '../utils/outbound-response.serializer';

describe('OutboundResponseSerializer', () => {
  it('serializes the return message to contain payload only', () => {
    const serializer = new OutboundResponseSerializer();
    expect(serializer).toBeDefined();
    jest.spyOn(serializer, 'serialize');
    const result = serializer.serialize({ pattern: 'someTopic', data: '0' });
    expect(serializer.serialize).toHaveBeenCalledTimes(1);
    expect(result).toBe('0');
  });
});
