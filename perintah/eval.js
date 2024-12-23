module.exports = {
  config: {
    name: "eval",
    penulis: "Hady Zen",
    kuldown: 6,
    peran: 2,
  },

  Alya: async function(api, event, args) {

        function output(msg) {

            if (typeof msg === 'number' || typeof msg === 'boolean' || typeof msg === 'function') {

                msg = msg.toString();

            } else if (msg instanceof Map) {

                let text = `Map(${msg.size}) `;

                text += JSON.stringify(mapToObj(msg), null, 2);

                msg = text;

            } else if (typeof msg === 'object') {

                msg = JSON.stringify(msg, null, 2);

            } else if (typeof msg === 'undefined') {

                msg = 'undefined';

            }

            api.sendMessage(msg, event.threadID);

        }



        function mapToObj(map) {

            const obj = {};

            map.forEach(function(v, k) {

                obj[k] = v;

            });

            return obj;

        }



        try {

            if (!args[0]) {

                return api.sendMessage("❌ Mohon masukkan kode yang akan dijalankan!", event.threadID);

            }



            const cmd = `

            (async () => {

                try {

                    ${args.join(" ")}

                }

                catch(err) {

                    console.error("eval command", err);

                    api.sendMessage(

                        "❌ Error:\\n" +

                        (err.stack ? err.stack.toString() : JSON.stringify(err, null, 2))

                    , event.threadID);

                }

            })()`;



            eval(cmd);

        } catch (error) {

            api.sendMessage(`❌ Error:

Input: ${args.join(" ")}
Error: ${error.message}`, event.threadID);

        }

    }

};
