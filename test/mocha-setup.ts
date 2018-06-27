import axios from 'axios';
import {wixAxiosConfig} from 'wix-axios-config';
import {baseURL} from './test-common';
import {use} from 'chai';
import * as sinonChai from 'sinon-chai';
use(sinonChai);

wixAxiosConfig(axios, {baseURL});
