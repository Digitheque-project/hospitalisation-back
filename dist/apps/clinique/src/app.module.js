"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const cpa_module_1 = require("./modules/cpa/cpa.module");
const vpa_module_1 = require("./modules/vpa/vpa.module");
const bloc_module_1 = require("./modules/bloc/bloc.module");
const patient_module_1 = require("./modules/patient/patient.module");
const hospitalisation_module_1 = require("./modules/hospitalisation/hospitalisation.module");
const signature_module_1 = require("./modules/signature/signature.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'sih'),
                    password: configService.get('DB_PASSWORD', 'sih'),
                    database: configService.get('DB_NAME', 'clinique'),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const playgroundEnabled = configService.get('GRAPHQL_PLAYGROUND_ENABLED', 'false') === 'true';
                    return {
                        autoSchemaFile: (0, path_1.join)(process.cwd(), 'apps/clinique/schema.gql'),
                        playground: playgroundEnabled,
                        introspection: playgroundEnabled,
                        context: ({ req }) => ({ req }),
                    };
                },
            }),
            cpa_module_1.CpaModule,
            vpa_module_1.VpaModule,
            bloc_module_1.BlocModule,
            patient_module_1.PatientModule,
            hospitalisation_module_1.HospitalisationModule,
            signature_module_1.SignatureModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map