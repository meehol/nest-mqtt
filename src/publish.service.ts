import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MqttContext } from '@nestjs/microservices';
import configuration from './config/configuration';

@Injectable()
export class PublishService {
  constructor(@Inject('MQTT_SERVICE') protected client: ClientProxy) {
    client.connect();
  }

  private state = {
    // converting array of topics to an object for persisting the state of child topics
    childrenTopicsValues: configuration.childTopics.map(() => '1'),
    // setting initial parent topic value to '1'
    parentTopicValue: '1',
  };

  isAllOne() {
    return this.state.childrenTopicsValues.every((v) => v === '1');
  }

  async publishToParent(value) {
    this.state.parentTopicValue = value;
    await this.client.emit(configuration.parentTopic, value);
  }

  async handleMessage(context: MqttContext) {
    const payload = Buffer.from(context.getPacket().payload).toString();
    const topicName = context.getTopic();
    const indexOfCurrentTopicInState =
      configuration.childTopics.indexOf(topicName);

    const isTheSameTopicValue =
      payload === this.state.childrenTopicsValues[indexOfCurrentTopicInState];
    if (isTheSameTopicValue || indexOfCurrentTopicInState === -1) return;

    this.state.childrenTopicsValues[indexOfCurrentTopicInState] = payload;

    if (payload === '0' && this.state.parentTopicValue === '1') {
      // if any new payload is 0 and current parent topic value is 1 - change parent topic to 0
      await this.publishToParent('0');
      return;
    } else if (this.isAllOne() && this.state.parentTopicValue === '0') {
      // if any new payload is 1, and all child topics are 1
      // and current parent topic value is 0 - change parent topic to 1
      await this.publishToParent('1');
      return;
    }
  }
}
