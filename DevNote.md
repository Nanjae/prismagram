# DevNote for "FullStack" with React and React-Native Development by JAEUK LEE a.k.a Nanjae

## 개발환경 구성
1. node.js
   - https://nodejs.org/ko/
   - 버전은 그냥 안정적인걸로 받자 => v10 이상이면 상관없음
   - 익숙해지면 최신 버전으로 해봐야지
2. npm or yarn
   - https://yarnpkg.com/lang/en/docs/install
   - 둘 중 하나만 있으면 되는데 npm은 node깔면 알아서 깔리고 yarn은 따로 깔아야 함
   - npm install yarn 보단 yarn 홈페이지에서 깔자 => 해본 결과 PATH 설정이 알아서 됨 => 매우 편함
   - 나는 yarn을 쓰는 편임
3. visual code
   - https://code.visualstudio.com/
   - 코드 에디터는 이게 젤 깔끔한거 같음 => 실은 extension 너무 많이 깔아버려서 이제 돌이킬 수 없음
4. git
   - 이제 git에 push 안해놓으면 로컬은 너무 불안해서 잠을 못잠
5. google chrome
   - 노코멘트
6. android studio or x-code
   - 앱 만들 때 테스트 용 => 그냥 여차하면 expo 써서 하지 뭐 => 지금은 window에서 하는 중이라 ios는 expo가 없인 못돌려봄
7. a lot of coffee
   - 개발시간 = 마신 커피 잔 수 => 난 라떼가 좋더라


## 프로젝트 생성
1. github repository
   - git init 하고 여러가지 하는 것보다 그냥 애초에 github에서 만들고 clone 하는게 편함 => 개인취향
   - 만들 때 .gitignore node.js로 만들고 하자 => 안하면? node_modules 폴더도 전부 올리고 싶은거라 생각함 => 혹시 뭐 더 필요하면 스크립트 작성해서 추가 가능
   - 까먹고 안만들었으면 gitignore.io 사이트 가서 만들면 됨 => 만들어보면 조금 다른데 push하는데 전혀 지장없음
2. yarn init
   - 이건 그냥 package.json에 들어가는 설정이라고 해야하나? => 질문하는거 대부분 그냥 default로 두는데 몇개는 적어주는 편임
   - 하고나면 package.json에 프로젝트의 기본 정보들이 들어감 => 이 package.json은 내가 생각할때 정말 git을 위해 존재하는거 같음 => dependency 설명할 때 더 적어봄
   - 그리고 그냥 main은 지워버려도 됨 => index.js 안 쓰게 될 걸? 아마도?
3. dependency
   - https://yarnpkg.com/en/docs/dependency-types#toc-dev-dependencies
   - 어어어어엄청 중요한 포인트! 개념은 머리 속에 있으니 딱히 적지 않겠음 => 궁금하면 구글링 고고
   - yarn add [package-name] 으로 package.json이랑 yarn.lock에 원하는 패키지를 추가할 수 있음
   - git에 node_modules 폴더를 push하지 않아도 clone 한 후 yarn install 하게 되면 알아서 적힌대로 깔아주니까 너무 편함
   1. graphql-yoga
      - https://github.com/prisma-labs/graphql-yoga
      - yarn add graphql-yoga
      - graphql을 편하게 사용할 수 있게 만들어진 오픈소스 패키지인데 graphql server를 진짜 쉽고 편하게 사용할 수 있게 해줌 => 실은 그냥 graphql을 써보진 않아서 비교불가
      - graphql로 개발한다? => 그럼 요녀석으로 개발하도록 하자
   2. nodemon
      - https://nodemon.io/
      - yarn add nodemon -D
      - -D 혹은 --dev을 붙이면 그냥 dependency가 아니라 devDependency로 들어가게됨 => 코드가 실행되는 동안 필요한게 아니라 요기다 넣을예정
      - 이건 소스코드 작성 후 저장하면 자동으로 서버를 재시작해주는 패키지인데 있으면 따로 서버 껐다 켰다 안하고 알아서 해줌 => 매우 편함
   3. server.js
      - src 폴더에 생성
      - 다음 단계에서 쓰게됨
   4. package.json
      - 소스 추가
         "scripts": {
            "dev": "nodemon --exec babel-node src/server.js"
         }
      - 이건 패키지가 아니라 package.json에서 수정을 해야되는 순서임 => "dev" 말고 "start"로 쓰는 편인데 난 그냥 배웠던대로 "dev" 씀
      - 이제 yarn dev 해주면 "nodemon --exec babel-node src/server.js"이 실행되는거지
   5. nodemon.json
      - { "ext" : "js graphql" }
      - nodemon이 감시할 파일의 확장자를 지정해주자 => .js랑 .graphql 파일이 수정 될 때마다 서버를 재시작 해줄거야

## 백엔드 구성 GraphQL Server
1. dotenv
   - https://github.com/motdotla/dotenv
   - yarn add dotenv
   - 포트나 DB같은 정보를 저장할 환경변수 파일을 "외부"에 만들고 관리하려고 쓰게되는데 그 .env 파일을 읽기 위해 필요함
   - .env 파일은 오픈소스로 프로젝트 공개할 때 .gitignore를 통해 제외하면 안전함
2. .env
   - src 폴더에 생성 및 소스 추가
      PORT=4000
   - 모든 설정값들을 .env에 추가하는 습관은 좋은거임
3. server.js
   - 소스 추가
      require("dotenv").config();
      import { GraphQLServer } from "graphql-yoga";

      const PORT = process.env.PORT || 4000;

      const typeDefs = `
            type Query{
               hello: String!
            }
      `;

      const resolvers = {
         Query: {
            hello: () => "Hi"
         }
      };

      const server = new GraphQLServer({ typeDefs, resolvers });

      server.start({ port: PORT }, () =>
         console.log(`Server running on http://localhost:${PORT}`)
      );
4. .babelrc
   - 파일 생성 및 소스 추가
      {
         "presets": ["@babel/preset-env"]
      }
   - bable 설정 파일인데 preset이랑 plugin 같은 걸 설정함
5. @babel/node
   - https://babeljs.io/docs/en/babel-node
   - yarn add @babel/node
   - babel CLI 도구 중 하나 => babel 명령줄 사용하게 해줌
6. @babel/preset-env
   - https://babeljs.io/docs/en/babel-preset-env
   - yarn add @babel/preset-env
   - babel preset 중 하나 => 호환되지 않는 상위 버전 언어의 코드를 transpile 해줌
7. @babel/core
   - https://babeljs.io/docs/en/babel-core
   - yarn add @babel/core
   - babel 핵심 파일 => 다른 babel 모듈들이 종속성을 가짐 => babel 사용하려면 명시적으로 추가해줘야 하는 건데 뭔지 잘 모르겠음
8. morgan
   - https://alligator.io/nodejs/getting-started-morgan/
   - yarn add morgan
   - logger 미들웨어. 즉, 로깅 전용 모듈인데 => HTTP 서버에서 로그 기록 남기는 역할을 함 => 서버를 서버답게 만들어준달까
9. server.js
   - 소스 추가
      import logger from "morgan"
      server.express.use(logger("dev"));
10. schema.js
   - src 폴더에 생성
   - api 폴더에 있는 graphql과 resolvers 파일을 합치는 역할
11. graphql-tools
   - https://www.apollographql.com/docs/graphql-tools/
   - yarn add graphql-tools
   - JavaScript GraphQL schema를 만들기 위한 패키지
12. merge-graphql-schemas
   - https://github.com/Urigo/merge-graphql-schemas
   - yarn add merge-graphql-schemas
   - schema를 구성할 query와 resolver를 합치기 위한 패키지
13. schema.js
   - 소스 추가
      import path from "path";
      import { makeExecutableSchema } from "graphql-tools";
      import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";

      const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql"));
      const allResolvers = fileLoader(path.join(__dirname, "/api/**/*.js"));

      const schema = makeExecutableSchema({
         typeDefs: mergeTypes(allTypes),
         resolvers: mergeResolvers(allResolvers)
      });

      export default schema;
14. folders and files for schema
   - src/api/--/--/--.graphql => Query 소스 예제
      type Query {
         sayHello: String!
      }
   - src/api/--/--/--.js => Resolver 소스 예제
      export default {
         Query: {
            sayHello: () => "Hello"
         }
      };
   - src/schema.js => Query와 Resolver를 모아서 import함
15. server.js
   - 소스 수정
      import schema from "./schema";
      const server = new GraphQLServer({ schema });
   - 기존 typeDefs와 resolvers => schema
   - 나중에 많은 query와 resolver가 생기면 관리하기 편할거 같음

## 백앤드 구성 Prisma