import React from 'react';
import AsyncBtn from '../../video-conference/ui-components/async-btn/AsyncBtn';

export default {
  title: 'AsyncButton'
};

export const text = () => (
  <AsyncBtn title="Join Conference" inProgress />
);
