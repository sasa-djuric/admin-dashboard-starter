import {
	Connection,
	EntitySubscriberInterface,
	EventSubscriber,
	InsertEvent,
	UpdateEvent
} from 'typeorm';
import { User } from './user.entity';
import { hash } from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
	constructor(connection: Connection) {
		connection?.subscribers?.push(this);
	}

	listenTo() {
		return User;
	}

	async beforeInsert(event: InsertEvent<User>) {
		if (event.entity.password) {
			event.entity.password = await hash(event.entity.password, 10);
		}
	}

	async beforeUpdate(event: UpdateEvent<User>) {
		if (event.entity.password) {
			event.entity.password = await hash(event.entity.password, 10);
		}
	}
}
