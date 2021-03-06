FROM belalelhossany/start 

WORKDIR '/app'

COPY ./package.json /app/package.json

WORKDIR /app
ENTRYPOINT ["/bin/bash"]
RUN sudo npm install

COPY . /app
EXPOSE 3000
CMD ["startcommand.sh"]
