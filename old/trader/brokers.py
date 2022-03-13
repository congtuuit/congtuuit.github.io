from __future__ import (absolute_import, division, print_function,
                        unicode_literals)

import argparse
import datetime

import backtrader as bt
import backtrader.indicators as btind


class MyBuySell(bt.observers.BuySell):
    plotlines = dict(
        buy=dict(marker='$\u21E7$', markersize=15.0),
        sell=dict(marker='$\u21E9$', markersize=15.0)
    )


class MACrossOver(bt.SignalStrategy):
    params = (('ma', bt.ind.MovAv.SMA),
              ('p1', 10),
              ('p2', 20),
              ('smaperiod', 15),
              ('limitperc', 1.0),
              ('valid', 7),)

    def __init__(self):
        ma1, ma2 = self.p.ma(period=self.p.p1), self.p.ma(period=self.p.p2)
        self.signal_add(bt.SIGNAL_LONGSHORT, bt.ind.CrossOver(ma1, ma2))
        #sma = btind.SMA(period=self.p.smaperiod)
        # self.signal_add(bt.SIGNAL_SHORT, bt.ind.CrossOver(
        #     self.data.close, sma, plot=True))


class MyStrategy(bt.Strategy):
    params = (
        ('smaperiod', 15),
        ('limitperc', 1.0),
        ('valid', 7),
    )

    def log(self, txt, dt=None):
        ''' Logging function fot this strategy'''
        dt = dt or self.data.datetime[0]
        if isinstance(dt, float):
            dt = bt.num2date(dt)
        print('%s, %s' % (dt.isoformat(), txt))

    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            # Buy/Sell order submitted/accepted to/by broker - Nothing to do
            self.log('ORDER ACCEPTED/SUBMITTED', dt=order.created.dt)
            self.order = order
            return

        if order.status in [order.Expired]:
            self.log('BUY EXPIRED')

        elif order.status in [order.Completed]:
            if order.isbuy():
                self.log(
                    'BUY EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                    (order.executed.price,
                     order.executed.value,
                     order.executed.comm))

            else:  # Sell
                self.log('SELL EXECUTED, Price: %.2f, Cost: %.2f, Comm %.2f' %
                         (order.executed.price,
                          order.executed.value,
                          order.executed.comm))

        # Sentinel to None: new orders allowed
        self.order = None

    def __init__(self):
        # SimpleMovingAverage on main data
        # Equivalent to -> sma = btind.SMA(self.data, period=self.p.smaperiod)
        sma = btind.SMA(period=self.p.smaperiod)

        # CrossOver (1: up, -1: down) close / sma
        self.buysell = btind.CrossOver(self.data.close, sma, plot=True)

        # Sentinel to None: new ordersa allowed
        self.order = None

    def next(self):
        if self.order:
            # pending order ... do nothing
            return

        # Check if we are in the market
        if self.position:
            if self.buysell < 0:
                self.log('SELL CREATE, %.2f' % self.data.close[0])
                self.sell()

        elif self.buysell > 0:
            plimit = self.data.close[0] * (1.0 - self.p.limitperc / 100.0)
            valid = self.data.datetime.date(0) + \
                datetime.timedelta(days=self.p.valid)
            self.log('BUY CREATE, %.2f' % plimit)
            self.buy(exectype=bt.Order.Limit, price=plimit, valid=valid)


def runstrat(args=None):
    args = parse_args(args)

    cerebro = bt.Cerebro()

    # Data feed kwargs
    kwargs = dict(dataname=args.yahoo or args.data)

    # Parse from/to-date
    dtfmt, tmfmt = '%Y-%m-%d', 'T%H:%M:%S'
    for a, d in ((getattr(args, x), x) for x in ['fromdate', 'todate']):
        if a:
            strpfmt = dtfmt + tmfmt * ('T' in a)
            kwargs[d] = datetime.datetime.strptime(a, strpfmt)

    # Data feed kwargs
    if args.yahoo:
        data0 = bt.feeds.YahooFinanceData(**kwargs)
    else:
        data0 = bt.feeds.BacktraderCSVData(**kwargs)
    cerebro.adddata(data0)

    # Broker
    kwargs = eval('dict(' + args.broker + ')')
    cerebro.broker = bt.brokers.BackBroker(**kwargs)

    # Sizer
    kwargs = eval('dict(' + args.sizer + ')')
    cerebro.addsizer(bt.sizers.FixedSize, **kwargs)

    # Strategy
    kwargs = eval('dict(' + args.strat + ')')
    cerebro.addstrategy(MACrossOver, **kwargs)

    # better net liquidation value view
    cerebro.addobserver(bt.observers.Value)

    # Patch observer if needed
    if args.myobserver:
        bt.observers.BuySell = MyBuySell

    # Execute
    cerebro.run(**(eval('dict(' + args.cerebro + ')')))

    if args.plot:  # Plot if requested to
        cerebro.plot(**(eval('dict(' + args.plot + ')')))


def parse_args(pargs=None):

    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        description='buysell arrows ...')

    pgroup = parser.add_mutually_exclusive_group(required=False)
    pgroup.add_argument('--data', required=False,
                        default='../../datas/2005-2006-day-001.txt',
                        help='Data to read in')

    pgroup.add_argument('--yahoo', required=False, default='',
                        metavar='TICKER', help='Yahoo ticker to download')

    parser.add_argument('--fromdate', required=False, default='',
                        help='Date[time] in YYYY-MM-DD[THH:MM:SS] format')

    parser.add_argument('--todate', required=False, default='',
                        help='Date[time] in YYYY-MM-DD[THH:MM:SS] format')

    parser.add_argument('--cerebro', required=False, default='',
                        metavar='kwargs', help='kwargs in key=value format')

    parser.add_argument('--broker', required=False, default='',
                        metavar='kwargs', help='kwargs in key=value format')

    parser.add_argument('--sizer', required=False, default='',
                        metavar='kwargs', help='kwargs in key=value format')

    parser.add_argument('--strat', required=False, default='',
                        metavar='kwargs', help='kwargs in key=value format')

    parser.add_argument('--plot', required=False, default='',
                        nargs='?', const='{}',
                        metavar='kwargs', help='kwargs in key=value format')

    parser.add_argument('--myobserver', required=False, action='store_true',
                        help='Patch in Custom BuySell observer')

    return parser.parse_args(pargs)
