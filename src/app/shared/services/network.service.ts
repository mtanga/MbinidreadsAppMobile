import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Network} from '@awesome-cordova-plugins/network/ngx';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
	providedIn: 'root',
})
export class NetworkService {
	public onConnect: Observable<any>;
	networkInfo = {
		state: {
			error: false
		},
		error: {
			timedout: false, // La connection est trop lente
			nonetwork: false, // Le téléphone n'est pas connecté à un réseau
			noapi: false // L'api est injoignable
		}
	};

	constructor(public network: Network, private http: HttpClient, public translateService: TranslateService) {

		// watch network for a disconnect
		let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
			//console.log('NETWORK : network was disconnected');
			this.networkInfo.state.error = true;
			this.networkInfo.error.nonetwork = true;
		});

		// watch network for a connection
		this.onConnect = this.network.onConnect();
		let connectSubscription = this.onConnect.subscribe(() => {
			//console.log('NETWORK : network connected!');

			// We just got a connection but we need to wait briefly
			// before we determine the connection type. Might need to wait.
			// prior to doing any api requests as well.
			setTimeout(() => {
			}, 3000);
		});
	}

	async check_connectivity() {
		//console.log('NetworkService - connected()');
		//We define another object to avoid a data change while
		//the answer is loading
		const netInfo = {
			state: {
				error: false
			},
			error: {
				timedout: false, // The connection is too slow
				nonetwork: false, // The device is offline
				noapi: false // The API is not reachable
			}
		};

		await this.checkNetworkState();
		//await this.checkApiState();
		return true;
	}

	checkNetworkState(): Promise<any> {
		// async receive data
		return new Promise(async (resolve, reject) => {
			if (!this.network) {
				reject({
					code: 'NO_NETWORK',
					message: await this.translateService.get('device_is_offline').toPromise()
				});
			} else if (this.network.type == 'none' /* || !this.network.type  */) {
				reject({
					code: 'NO_NETWORK',
					message: await this.translateService.get('device_is_offline').toPromise()
				});
			} else {
				resolve(null);
			}
		});
	}

	checkApiState(): Promise<any> {
		// async receive data
		console.log("checkApiState by michel");
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(async () => {
				//Connection timedout
				//console.log('--checkApiState timedout');
				reject({
					code: 'TIME_OUT',
					message: await this.translateService.get('connection_is_to_slow').toPromise()
				});
			}, 10000);

			// this.http.get('https://smartedafrica.herokuapp.com/_ah/health').subscribe(
			// this.http.get('https://smartdafrica-staging.herokuapp.com/_ah/health').subscribe(

			this.http.get('https://smartedafrica.herokuapp.com/_ah/health').subscribe(
				res => {
					clearTimeout(timeout);
					//console.log('--API is online');
					//console.log(res);
					resolve(null);
				},
				async () => {
					clearTimeout(timeout);
					reject({
						code: 'NO_API',
						message: await this.translateService.get('device_is_offline').toPromise()
					});
				}
			);
		});
	}
}
