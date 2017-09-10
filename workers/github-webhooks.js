require("promise.prototype.finally").shim()

const axios = require("axios")
const path = require("path")
const spawn = require("child_process").spawn
const zmq = require("zeromq")
const zmqSockets = require(path.join(__dirname + "../config/zeromq.json"))

const subscriber = zmq.socket("sub")
subscriber.subscribe("webhook")
subscriber.connect(zmqSockets["worker-sub"])

subscriber.on("message", function (channel, data) {
  console.log("channel: ", channel.toString())

  const { action, pull_request } = JSON.parse(data.toString())
  if (action === 'closed' && pull_request['merged']) {
    console.log("merged :)")
    const script = path.join(__dirname, "github-webhooks.sh")
    const restart = spawn(script)
    restart.stdout.on("data", output => console.log("stdout: " + output))
    restart.stderr.on("data", error => console.log("stderr: " + error))
    restart.on("exit", code => console.log("github webhook exited with code: " + code))
  } else {
    console.log("not merged :(")
  }
})
