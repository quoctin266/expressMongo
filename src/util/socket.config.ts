import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { UpdateCourseDto } from "../course/dto/update-course.dto";

const frontendDomain =
  process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;

export default class SocketConfig {
  static io: Server;

  static initializeSocket(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: frontendDomain,
      },
    });

    this.io.on("connection", (socket) => {
      console.log("client: ", socket.id);
      socket.emit("connected", "Connection created");
    });
  }

  static emitUpdatedCourse(updatedCourse: UpdateCourseDto) {
    this.io.emit("onCourseUpdated", updatedCourse);
  }
}

// let io: Server;

// export function initializeSocket(httpServer: HttpServer) {
//   io = new Server(httpServer, {
//     cors: {
//       origin: frontendDomain,
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("client: ", socket.id);
//     socket.emit("connected", "Connection created");
//   });
// }

// export function emitUpdatedCourse(productId, quantity) {
//   io.emit('productQuantityUpdated', { productId, quantity });
// }
